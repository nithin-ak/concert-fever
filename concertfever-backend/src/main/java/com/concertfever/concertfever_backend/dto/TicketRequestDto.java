package com.concertfever.concertfever_backend.dto;

import java.math.BigDecimal;

public record TicketRequestDto(Integer eventId, Character ticketCategory, BigDecimal finalPrice) {
}
