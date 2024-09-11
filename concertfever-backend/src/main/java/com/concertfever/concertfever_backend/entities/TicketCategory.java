package com.concertfever.concertfever_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "ticket_category", schema = "concertfever")
public class TicketCategory {
    @EmbeddedId
    private TicketCategoryId ticketCategoryId;

    @MapsId("eventId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false) // was EAGER
    @JoinColumn(name = "event_id", nullable = false)
    @JsonBackReference // Manage serialization
    private Event eventId;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "remaining_quantity", nullable = false)
    private Integer remainingQuantity;

}