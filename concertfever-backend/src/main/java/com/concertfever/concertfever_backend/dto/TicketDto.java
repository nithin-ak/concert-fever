package com.concertfever.concertfever_backend.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TicketDto(Integer ticketId, Integer eventEventId, String eventVenueVenueName, String eventVenueCountry,
                        String eventEventName, LocalDate eventStartDate, LocalDate eventEndDate, Integer userUserId,
                        String userEmail, Character ticketCategory, BigDecimal finalPrice,
                        LocalDate purchaseDate) implements Serializable {
}