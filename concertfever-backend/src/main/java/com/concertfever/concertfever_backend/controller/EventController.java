package com.concertfever.concertfever_backend.controller;

import com.concertfever.concertfever_backend.dto.EventFullDetailsDto;
import com.concertfever.concertfever_backend.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for handling event-related HTTP requests.
 * Provides endpoints for retrieving event details and associated ticket categories.
 */
@RestController
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;

    /**
     * Constructs an instance of {@link EventController}.
     *
     * @param eventService The service for handling event-related operations.
     */
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Retrieves full details for all events.
     *
     * @return A {@link ResponseEntity} containing a list of full details for all events.
     */
    @GetMapping("/getalleventsfulldetails")
    public ResponseEntity<List<EventFullDetailsDto>> getAllEventsFullDetails() {
        List<EventFullDetailsDto> allEvents = eventService.getAllEventsFullDetails();
        return ResponseEntity.ok(allEvents);
    }


    /**
     * Retrieves full details for events filtered by category.
     *
     * @param categoryStr The category to filter events by.
     * @return A {@link ResponseEntity} containing a list of full details for events in the specified category,
     *         or a BAD_REQUEST status if the category is invalid.
     */
    @GetMapping("/geteventfulldetailsbycategory")
    public ResponseEntity<?> getEventFullDetailsByCategory(@RequestParam("category") String categoryStr) {
        try {
            List<EventFullDetailsDto> eventDtos = eventService.getEventFullDetailsByCategory(categoryStr);
            return ResponseEntity.ok(eventDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Retrieves full details for an event specified by its ID.
     *
     * @param eventId The ID of the event to retrieve.
     * @return A {@link ResponseEntity} containing full details of the specified event,
     *         or a NOT_FOUND status if the event does not exist.
     */
    @GetMapping("/geteventfulldetailsbyeventid")
    public ResponseEntity<?> getEventFullDetailsByEventId(@RequestParam("eventId") Integer eventId) {
        try {
            EventFullDetailsDto dto = eventService.getEventFullDetailsByEventId(eventId);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
