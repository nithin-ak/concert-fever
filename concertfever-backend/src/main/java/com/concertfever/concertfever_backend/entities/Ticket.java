package com.concertfever.concertfever_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "tickets", schema = "concertfever")
public class Ticket {
    @Id
    @Column(name = "ticket_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ticketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonBackReference // Manage serialization
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference // Manage serialization
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    @JsonBackReference // Manage serialization
    private DiscountCoupon coupon;

    @Column(name = "ticket_category", nullable = false)
    private Character ticketCategory;

    @Column(name = "final_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    public Ticket(Event event, User user, DiscountCoupon coupon, Character ticketCategory, BigDecimal finalPrice, LocalDate purchaseDate) {
        this.event = event;
        this.user = user;
        this.coupon = coupon;
        this.ticketCategory = ticketCategory;
        this.finalPrice = finalPrice;
        this.purchaseDate = purchaseDate;
    }

}