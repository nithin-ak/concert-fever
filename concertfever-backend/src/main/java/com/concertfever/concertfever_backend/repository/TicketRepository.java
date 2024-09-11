package com.concertfever.concertfever_backend.repository;

import com.concertfever.concertfever_backend.dto.TicketDto;
import com.concertfever.concertfever_backend.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    @Query("SELECT new com.concertfever.concertfever_backend.dto.TicketDto(t.ticketId, t.event.eventId, t.event.venue.venueName, t.event.venue.country, t.event.eventName, t.event.startDate, t.event.endDate, t.user.userId, t.user.email, t.ticketCategory, t.finalPrice, t.purchaseDate) FROM Ticket t WHERE t.user.userId = :userId")
    List<TicketDto> findByUserId(@Param("userId") Integer userId);
}