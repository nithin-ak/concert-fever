package com.concertfever.concertfever_backend.dto;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link com.concertfever.concertfever_backend.entities.TicketCategory}
 */
public record TicketCategoryDto(Character ticketCategoryIdTicketCategory,
                                BigDecimal price, Integer totalQuantity,
                                Integer remainingQuantity) implements Serializable {
}