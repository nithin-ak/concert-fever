package com.concertfever.concertfever_backend.service;

import com.concertfever.concertfever_backend.dto.ChangeUserPasswordDto;
import com.concertfever.concertfever_backend.dto.NewUserDto;
import com.concertfever.concertfever_backend.entities.User;
import com.concertfever.concertfever_backend.entities.UserConfidential;
import com.concertfever.concertfever_backend.repository.UserConfidentialRepository;
import com.concertfever.concertfever_backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;

/**
 * Service for handling user-related operations such as retrieving user details, updating account balance, and managing user passwords.
 */
@Service
public class UserService {

    private final LocalDate TODAY = LocalDate.now();
    private final UserRepository userRepository;
    private final UserConfidentialRepository confidentialRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    /**
     * Constructs an instance of {@link UserService}.
     *
     * @param userRepository         The repository for accessing user data.
     * @param confidentialRepository The repository for accessing user confidential data.
     */
    public UserService(UserRepository userRepository, UserConfidentialRepository confidentialRepository, BCryptPasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.confidentialRepository = confidentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Retrieves a user by email.
     *
     * @param email The email of the user to be retrieved.
     * @return The {@link User} entity if found.
     * @throws EntityNotFoundException if the user is not found.
     */
    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }
        return user;
    }

    /**
     * Checks the password of a user identified by email.
     *
     * @param email The email of the user whose password is to be checked.
     * @return The user's password.
     * @throws EntityNotFoundException if the user or password is not found.
     */
    public boolean checkPassword(String email, String rawPassword) {
        User user = getUserByEmail(email);
        UserConfidential userConfidential = confidentialRepository.findById(user.getUserId()).orElseThrow(() -> new EntityNotFoundException("Password not found"));
        if (userConfidential != null) {
            return passwordEncoder.matches(rawPassword, userConfidential.getPassword());
        }
        return false;
    }

    /**
     * Checks the account balance of a user identified by email.
     *
     * @param email The email of the user whose account balance is to be checked.
     * @return The user's account balance.
     * @throws EntityNotFoundException if the user or account balance is not found.
     */
    public BigDecimal checkAccountBalance(String email) {
        User user = getUserByEmail(email);
        UserConfidential userConfidential = confidentialRepository.findById(user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("No balance set"));
        return userConfidential.getAccountBalance();
    }

    /**
     * Updates the account balance of a user.
     *
     * @param email The email of the user whose account balance is to be updated.
     * @param topUp The amount to add to the user's account balance.
     * @return A success message if the balance is updated successfully.
     * @throws EntityNotFoundException if the user is not found.
     */
    @Transactional
    public String updateAccountBalance(String email, BigDecimal topUp) {
        User user = getUserByEmail(email);
        int userId = user.getUserId();

        try {
            UserConfidential userConfidential = confidentialRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User data not found"));
            BigDecimal currentBalance = userConfidential.getAccountBalance();
            BigDecimal newBalance = currentBalance.add(topUp);
            userConfidential.setAccountBalance(newBalance);
            confidentialRepository.save(userConfidential);
            return "Account balance updated. New balance: " + newBalance;
        } catch (Exception e) {
            throw new RuntimeException("ERROR: Balance not updated", e);
        }
    }

    /**
     * Changes the password for a user.
     *
     * @param changeUserPasswordDto The data transfer object containing the email and new password.
     * @return A success message if the password is updated successfully.
     * @throws EntityNotFoundException if the user is not found.
     */
    @Transactional
    public String changeUserPassword(ChangeUserPasswordDto changeUserPasswordDto) throws BadRequestException {
        String email = changeUserPasswordDto.email();
        String currentPassword = changeUserPasswordDto.currentPassword();
        String newPassword = changeUserPasswordDto.newPassword();
        User user = getUserByEmail(email);
        int userId = user.getUserId();

        UserConfidential userConfidential = confidentialRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User data not found"));

        String currentPasswordInDb = userConfidential.getPassword();

        if (!passwordEncoder.matches(currentPassword, currentPasswordInDb)) {
            throw new BadRequestException("Passwords do not match");
        }

        String encryptedPassword = passwordEncoder.encode(newPassword);

        userConfidential.setPassword(encryptedPassword);
        userConfidential.setPasswordLastChangedAt(TODAY);

        confidentialRepository.save(userConfidential);
        return "Password Updated Successfully";
    }

    /**
     * Updates the last login time for a user.
     *
     * @param email The email of the user whose login time is to be updated.
     * @return A success message if the login time is updated successfully.
     * @throws EntityNotFoundException if the user or user confidential data is not found.
     */
    @Transactional
    public String updateUserLoginTime(String email) {
        User user = getUserByEmail(email);
        UserConfidential userConfidential = confidentialRepository.findById(user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User data not found"));
        userConfidential.setIdLastLogin(TODAY);
        confidentialRepository.save(userConfidential);
        return "Login Time Updated Successfully";
    }

    /**
     * Creates a new user.
     *
     * @param userDto The data transfer object containing user details.
     * @return A success message if the user is created successfully.
     * @throws IllegalArgumentException if the email already exists.
     */
    @Transactional
    public String createUser(NewUserDto userDto) {
        String email = userDto.email();
        if (userRepository.findByEmail(email) == null) {
            User newUser = new User(userDto.firstName(), userDto.lastName(), email);
            User savedUser = userRepository.save(newUser);

            String encodedPassword = passwordEncoder.encode(userDto.password());

            UserConfidential userConfidential = new UserConfidential(
                    savedUser, TODAY, TODAY, encodedPassword, TODAY, userDto.accountBalance()
            );
            confidentialRepository.save(userConfidential);

            return "User Created Successfully";
        } else {
            throw new IllegalArgumentException("Email Address Already Exists. Try again");
        }
    }

    /**
     * Sends a password reset email to the user.
     *
     * @param emailId The email of the user requesting a password reset.
     * @return A success message if the password reset email is sent successfully.
     * @throws MessagingException if there is an error sending the email.
     * @throws EntityNotFoundException if the user is not found.
     */
    @Transactional
    public String forgotPassword(String emailId) throws MessagingException {
        emailId = emailId.toLowerCase();
        User user = getUserByEmail(emailId);
        if (user != null) {
            String tempPassword = generateTempPasswordForUser(emailId);
            String subject = "ConcertFever Password Reset";
            String htmlBody = "Your temporary password is: <b>" + tempPassword+"</b>";
            emailService.sendHtmlMessage(emailId, subject, htmlBody);
            return "Password reset successfully. Please check your email for the temporary password.";
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }

    /**
     * Generates and sets a temporary password for the user, then updates it in the database.
     *
     * @param email The email of the user for whom the temporary password is generated.
     * @return The temporary password.
     */
    @Transactional
    public String generateTempPasswordForUser(String email) {
        User user = userRepository.findByEmail(email);
        UserConfidential userConfidential = confidentialRepository.findById(user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User data not found"));
        if (userConfidential != null) {
            String tempPassword = generateRandomPassword();
            userConfidential.setPassword(passwordEncoder.encode(tempPassword));
            userRepository.save(user);
            return tempPassword;
        }
        throw new RuntimeException("User not found");
    }

    /**
     * Generates a random password with a length of 10 characters. The generated password includes uppercase letters,
     * lowercase letters, digits, and special characters.
     *
     * @return The generated random password.
     */
    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        int length = 10;
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(62); // Generate a random index from 0 to 61
            if (index < 10) {
                password.append((char) ('0' + index));
            } else if (index < 36) {
                password.append((char) ('A' + index - 10));
            } else {
                password.append((char) ('a' + index - 36));
            }
        }
        return password.toString();
    }

}
