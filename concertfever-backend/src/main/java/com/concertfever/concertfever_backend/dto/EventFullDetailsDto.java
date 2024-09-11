package com.concertfever.concertfever_backend.dto;

import com.concertfever.concertfever_backend.entities.Category;
import com.concertfever.concertfever_backend.entities.Venue;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for {@link com.concertfever.concertfever_backend.entities.Event}
 */
public record EventFullDetailsDto(Integer eventId, Venue venue, List<TicketCategoryDto> ticketCategoryDto, String eventName,
                                  LocalDate startDate, LocalDate endDate, String description,
                                  Category category) implements Serializable {
}
