package com.concertfever.concertfever_backend.service;

import com.concertfever.concertfever_backend.dto.PurchaseTicketsDto;
import com.concertfever.concertfever_backend.dto.TicketCategoryDto;
import com.concertfever.concertfever_backend.dto.TicketDto;
import com.concertfever.concertfever_backend.dto.TicketRequestDto;
import com.concertfever.concertfever_backend.entities.*;
import com.concertfever.concertfever_backend.repository.*;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Service for handling ticket-related operations such as retrieving tickets, ticket categories, and purchasing tickets.
 */
@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final UserConfidentialRepository confidentialRepository;
    private final EventRepository eventRepository;
    private final DiscountCouponRepository discountCouponRepository;
    private final TicketCategoryRepository ticketCategoryRepository;
    private final EmailService emailService;

    private final LocalDate TODAY = LocalDate.now();

    /**
     * Constructs an instance of {@link TicketService}.
     *
     * @param ticketRepository         The repository for accessing ticket data.
     * @param userRepository           The repository for accessing user data.
     * @param confidentialRepository   The repository for accessing user confidential data.
     * @param eventRepository          The repository for accessing event data.
     * @param discountCouponRepository The repository for accessing discount coupon data.
     * @param ticketCategoryRepository The repository for accessing ticket category data.
     */
    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, UserConfidentialRepository confidentialRepository, EventRepository eventRepository,
                         DiscountCouponRepository discountCouponRepository, TicketCategoryRepository ticketCategoryRepository, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.confidentialRepository = confidentialRepository;
        this.eventRepository = eventRepository;
        this.discountCouponRepository = discountCouponRepository;
        this.ticketCategoryRepository = ticketCategoryRepository;
        this.emailService = emailService;
    }

    /**
     * Retrieves all tickets associated with a user identified by email.
     *
     * @param email The email of the user whose tickets are to be retrieved.
     * @return A list of {@link TicketDto} objects representing the tickets for the user.
     * @throws EntityNotFoundException if the user is not found.
     */
    public List<TicketDto> getAllTicketsByUserEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }
        Integer userId = user.getUserId();
        return ticketRepository.findByUserId(userId);
    }

    /**
     * Retrieves all ticket categories for a specific event.
     *
     * @param eventId The ID of the event whose ticket categories are to be retrieved.
     * @return A list of {@link TicketCategoryDto} objects representing the ticket categories for the event.
     */
    public List<TicketCategoryDto> getAllTicketCategoriesByEventId(int eventId) {
        return ticketCategoryRepository.findTicketCategoriesByEventId(eventId);
    }

    /**
     * Processes the purchase of tickets for a user, including updating the user's balance.
     *
     * @param purchaseTicketsDto The data transfer object containing purchase details, including user ID, coupon ID, and ticket requests.
     * @throws EntityNotFoundException if the user, coupon, event, or ticket category is not found.
     */
    @Transactional
    public void purchaseTickets(PurchaseTicketsDto purchaseTicketsDto) throws MessagingException {
        User user = userRepository.findById(purchaseTicketsDto.userId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        UserConfidential userConfidential = confidentialRepository.findById(purchaseTicketsDto.userId()).get();

        // Check if user has sufficient balance for purchase
        BigDecimal totalCartPrice = BigDecimal.ZERO;
        for(TicketRequestDto ticketDto : purchaseTicketsDto.tickets()){
            totalCartPrice = totalCartPrice.add(ticketDto.finalPrice());
        }

        BigDecimal userAccountBalance = userConfidential.getAccountBalance();

        if (userAccountBalance.compareTo(totalCartPrice) < 0){
            throw new EntityNotFoundException("User account balance is less than total cart price");
        }

        DiscountCoupon coupon = discountCouponRepository.findById(purchaseTicketsDto.couponId())
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found"));

        for (TicketRequestDto ticketDto : purchaseTicketsDto.tickets()) {
            Event event = eventRepository.findById(ticketDto.eventId())
                    .orElseThrow(() -> new EntityNotFoundException("Event not found"));

            TicketCategoryId ticketCategoryId = new TicketCategoryId(ticketDto.eventId(), ticketDto.ticketCategory());
            TicketCategory ticketCategoryChar = ticketCategoryRepository.findById(ticketCategoryId)
                    .orElseThrow(() -> new EntityNotFoundException("Ticket Category not found"));

            Character ticketCategory = ticketCategoryChar.getTicketCategoryId().getTicketCategory();

            // Create and save the new ticket
            Ticket ticket = new Ticket(event, user, coupon, ticketCategory, ticketDto.finalPrice(), TODAY);
            ticketRepository.save(ticket);

            // Update user balance
            BigDecimal currentBalance = userConfidential.getAccountBalance();
            BigDecimal newBalance = currentBalance.subtract(ticketDto.finalPrice());
            userConfidential.setAccountBalance(newBalance);
            confidentialRepository.save(userConfidential);
        }

        //Send Email
        String emailId = user.getEmail();
        String subject = "Purchase Confirmation";

        // Build the ticket details table rows
        StringBuilder tableRows = new StringBuilder();
        int sequence = 0; // index number
        for (TicketRequestDto ticketDto : purchaseTicketsDto.tickets()) {
            Event event = eventRepository.findById(ticketDto.eventId())
                    .orElseThrow(() -> new EntityNotFoundException("Event not found"));
            String eventName = event.getEventName();
            Character ticketCategory = ticketDto.ticketCategory();
            sequence++;
            BigDecimal finalPrice = ticketDto.finalPrice();
            tableRows.append(String.format(
                    "<tr>" +
                            "<td>%d</td>" +
                            "<td>%s</td>" +
                            "<td>%s</td>" +
                            "<td>$%.2f</td>" +
                            "</tr>",
                    sequence, eventName, ticketCategory, finalPrice
            ));
        }

        // HTML Body template
        String htmlBody = String.format("""
                <h1>ConcertFever Purchase Confirmation</h1>
                <p>Your purchase was completed successfully. Thank you for shopping with us!</p>
                <h2>Ticket Details</h2>
                <table border="1" cellpadding="10">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Event Name</th>
                      <th>Category</th>
                      <th>Final Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    %s
                  </tbody>
                </table>
                <p>Login to your account to retrieve ticket details.</p>
                """, tableRows);
        emailService.sendHtmlMessage(emailId, subject, htmlBody);
    }
}
