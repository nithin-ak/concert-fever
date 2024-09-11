package com.concertfever.concertfever_backend.controller;

import com.concertfever.concertfever_backend.dto.ChangeUserPasswordDto;
import com.concertfever.concertfever_backend.dto.EmailRequest;
import com.concertfever.concertfever_backend.dto.NewUserDto;
import com.concertfever.concertfever_backend.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Controller for handling user-related HTTP requests.
 * <p>
 * Provides endpoints for retrieving user details, updating account balance, managing user passwords,
 * creating new users, and handling forgotten passwords.
 * </p>
 */
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    /**
     * Constructs an instance of {@link UserController}.
     *
     * @param userService The service for handling user-related operations.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retrieves a user by email.
     *
     * @param email The email of the user to be retrieved.
     * @return A {@link ResponseEntity} containing the user if found, or a NOT_FOUND status if the user is not found.
     */
    @GetMapping("/getuserbyemail")
    public ResponseEntity<?> getUserByEmail(@RequestParam("email") String email) {
        try {
            return ResponseEntity.ok(userService.getUserByEmail(email));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Checks the password of a user identified by email.
     *
     * @param email    The email of the user whose password is to be checked.
     * @param password The password to check.
     * @return A {@link ResponseEntity} containing the user's password if found, or a NOT_FOUND status if the user is not found.
     */
    @GetMapping("/checkuserpassword")
    public ResponseEntity<?> checkPassword(@RequestParam("email") String email, @RequestParam("password") String password) {
        try {
            return ResponseEntity.ok(userService.checkPassword(email, password));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Checks the account balance of a user identified by email.
     *
     * @param email The email of the user whose account balance is to be checked.
     * @return A {@link ResponseEntity} containing the user's account balance if found, or a NOT_FOUND status if the user is not found.
     */
    @GetMapping("/getuseraccountbalance")
    public ResponseEntity<?> checkAccountBalance(@RequestParam("email") String email) {
        try {
            return ResponseEntity.ok(userService.checkAccountBalance(email));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Updates the account balance of a user.
     * <p>
     * This method adds the specified amount to the user's account balance. If the user is not found, a
     * NOT_FOUND status is returned. If there is an issue with the request, a BAD_REQUEST status is returned.
     * </p>
     *
     * @param email The email of the user whose account balance is to be updated.
     * @param topUp The amount to add to the user's account balance.
     * @return A {@link ResponseEntity} with a success message if the balance is updated successfully, or an error message with the appropriate HTTP status.
     */
    @PutMapping("/topupaccountbalance")
    public ResponseEntity<String> updateAccountBalance(@RequestParam("email") String email, @RequestParam("topUp") BigDecimal topUp) {
        try {
            return ResponseEntity.ok(userService.updateAccountBalance(email, topUp));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Changes the password for a user.
     * <p>
     * This method updates the user's password based on the provided data transfer object. If the user is
     * not found, a NOT_FOUND status is returned. If the request is invalid, a BAD_REQUEST status is thrown.
     * </p>
     *
     * @param changeUserPasswordDto The data transfer object containing the email and new password.
     * @return A {@link ResponseEntity} with a success message if the password is updated successfully.
     */
    @PutMapping("/changeuserpassword")
    public ResponseEntity<String> changeUserPassword(@RequestBody ChangeUserPasswordDto changeUserPasswordDto) {
        try {
            return ResponseEntity.ok(userService.changeUserPassword(changeUserPasswordDto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Updates the last login time for a user.
     *
     * @param email The email of the user whose login time is to be updated.
     * @return A {@link ResponseEntity} with a success message if the login time is updated successfully.
     */
    @PutMapping("/updateuserlogintime")
    public ResponseEntity<String> updateUserLoginTime(@RequestParam("email") String email) {
        try {
            return ResponseEntity.ok(userService.updateUserLoginTime(email));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Creates a new user.
     * <p>
     * This method registers a new user using the provided data transfer object. If the email already exists,
     * a BAD_REQUEST status is returned. Otherwise, the user is created and a CREATED status is returned.
     * </p>
     *
     * @param userDto The data transfer object containing user details.
     * @return A {@link ResponseEntity} with a success message if the user is created successfully, or an error message if the email already exists.
     */
    @PostMapping("/createnewuser")
    public ResponseEntity<String> createUser(@RequestBody NewUserDto userDto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Handles password reset requests.
     * <p>
     * This method sends a password reset email to the specified address. If the user is not found,
     * a NOT_FOUND status is returned. Messaging exceptions are propagated if there are issues with sending the email.
     * </p>
     *
     * @param email The email of the user requesting a password reset.
     * @return A {@link ResponseEntity} with a success message if the reset email is sent successfully.
     * @throws MessagingException if there is an error while sending the password reset email.
     */
    @PutMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) throws MessagingException {
        try {
            return ResponseEntity.ok(userService.forgotPassword(email));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
