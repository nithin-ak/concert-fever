package com.concertfever.concertfever_backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
@Embeddable
public class TicketCategoryId implements Serializable {
    @Serial
    private static final long serialVersionUID = -953145055420879640L;
    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(name = "ticket_category", nullable = false)
    private Character ticketCategory;

    public TicketCategoryId() {
    }

    public TicketCategoryId(Integer eventId, Character ticketCategory) {
        this.eventId = eventId;
        this.ticketCategory = ticketCategory;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TicketCategoryId entity = (TicketCategoryId) o;
        return Objects.equals(this.eventId, entity.eventId) &&
                Objects.equals(this.ticketCategory, entity.ticketCategory);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, ticketCategory);
    }

}