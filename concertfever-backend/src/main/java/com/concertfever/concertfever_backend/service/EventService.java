package com.concertfever.concertfever_backend.service;

import com.concertfever.concertfever_backend.dto.EventFullDetailsDto;
import com.concertfever.concertfever_backend.dto.TicketCategoryDto;
import com.concertfever.concertfever_backend.entities.Category;
import com.concertfever.concertfever_backend.entities.Event;
import com.concertfever.concertfever_backend.repository.EventRepository;
import com.concertfever.concertfever_backend.repository.TicketCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for handling event-related operations such as retrieving event details and associated ticket categories.
 */
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TicketCategoryRepository ticketCategoryRepository;

    /**
     * Constructs an instance of {@link EventService}.
     *
     * @param eventRepository The repository for accessing event data.
     * @param ticketCategoryRepository The repository for accessing ticket category data.
     */
    public EventService(EventRepository eventRepository, TicketCategoryRepository ticketCategoryRepository) {
        this.eventRepository = eventRepository;
        this.ticketCategoryRepository = ticketCategoryRepository;
    }

    /**
     * Retrieves full details for all events.
     *
     * @return A list of {@link EventFullDetailsDto} objects representing the full details of all events.
     */
    public List<EventFullDetailsDto> getAllEventsFullDetails() {
        List<EventFullDetailsDto> allEvents = new ArrayList<>();

        for (Category category : Category.values()) {
            FindEventDetails(allEvents, category);
        }

        return allEvents;
    }

    /**
     * Retrieves full details for events filtered by category.
     *
     * @param categoryStr The category to filter events by.
     * @return A list of {@link EventFullDetailsDto} objects representing the full details of events in the specified category.
     * @throws IllegalArgumentException if the category is invalid.
     */
    public List<EventFullDetailsDto> getEventFullDetailsByCategory(String categoryStr) {
        Category category;
        try {
            category = Category.valueOf(categoryStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category");
        }

        List<EventFullDetailsDto> eventDtos = new ArrayList<>();
        FindEventDetails(eventDtos, category);

        return eventDtos;
    }

    /**
     * Retrieves full details for an event specified by its ID.
     *
     * @param eventId The ID of the event to retrieve.
     * @return An {@link EventFullDetailsDto} object representing the full details of the specified event.
     * @throws EntityNotFoundException if the event does not exist.
     */
    public EventFullDetailsDto getEventFullDetailsByEventId(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        List<TicketCategoryDto> ticketCategories = ticketCategoryRepository.findTicketCategoriesByEventId(event.getEventId());
        return new EventFullDetailsDto(
                event.getEventId(),
                event.getVenue(),
                ticketCategories,
                event.getEventName(),
                event.getStartDate(),
                event.getEndDate(),
                event.getDescription(),
                event.getCategory()
        );
    }

    // Helper Method
    private void FindEventDetails(List<EventFullDetailsDto> allEvents, Category category) {
        List<Event> events = eventRepository.findEventByCategory(category);
        for (Event event : events) {
            List<TicketCategoryDto> ticketCategories = ticketCategoryRepository.findTicketCategoriesByEventId(event.getEventId());
            EventFullDetailsDto dto = new EventFullDetailsDto(
                    event.getEventId(),
                    event.getVenue(),
                    ticketCategories,
                    event.getEventName(),
                    event.getStartDate(),
                    event.getEndDate(),
                    event.getDescription(),
                    event.getCategory()
            );
            allEvents.add(dto);
        }
    }
}
