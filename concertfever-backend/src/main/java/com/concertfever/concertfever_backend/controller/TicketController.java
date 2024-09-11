package com.concertfever.concertfever_backend.controller;

import com.concertfever.concertfever_backend.dto.PurchaseTicketsDto;
import com.concertfever.concertfever_backend.dto.TicketCategoryDto;
import com.concertfever.concertfever_backend.dto.TicketDto;
import com.concertfever.concertfever_backend.service.TicketService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling ticket-related HTTP requests.
 * Provides endpoints for retrieving user tickets, ticket categories, and purchasing tickets.
 */
@RestController
@RequestMapping("/ticket")
public class TicketController {

    private final TicketService ticketService;

    /**
     * Constructs an instance of {@link TicketController}.
     *
     * @param ticketService The service for handling ticket-related operations.
     */
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * Retrieves all tickets associated with a user identified by email.
     *
     * @param email The email of the user whose tickets are to be retrieved.
     * @return A {@link ResponseEntity} containing a list of tickets for the user, or a NOT_FOUND status if the user is not found.
     */
    @GetMapping("/getalluserticketsbyemail")
    public ResponseEntity<?> getAllTicketsByUserEmail(@RequestParam String email) {
        try {
            List<TicketDto> tickets = ticketService.getAllTicketsByUserEmail(email);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Retrieves all ticket categories for a specific event.
     *
     * @param eventId The ID of the event whose ticket categories are to be retrieved.
     * @return A {@link ResponseEntity} containing a list of ticket categories for the event, or a NOT_FOUND status if no categories are found.
     */
    @GetMapping("/getallticketcategoriesbyeventid")
    public ResponseEntity<List<TicketCategoryDto>> getAllTicketCategoriesByEventId(@RequestParam int eventId) {
        List<TicketCategoryDto> ticketCategories = ticketService.getAllTicketCategoriesByEventId(eventId);
        if (ticketCategories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ticketCategories, HttpStatus.OK);
    }

    /**
     * Processes the purchase of tickets for a user, including updating the user's balance.
     *
     * @param purchaseTicketsDto The data transfer object containing purchase details, including user ID, coupon ID, and ticket requests.
     * @return A {@link ResponseEntity} with a success message if tickets are purchased successfully, or an error message with the appropriate HTTP status.
     */
    @PostMapping("/purchasetickets")
    public ResponseEntity<String> createTickets(@RequestBody PurchaseTicketsDto purchaseTicketsDto) {
        try {
            ticketService.purchaseTickets(purchaseTicketsDto);
            return new ResponseEntity<>("Tickets purchased successfully", HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
