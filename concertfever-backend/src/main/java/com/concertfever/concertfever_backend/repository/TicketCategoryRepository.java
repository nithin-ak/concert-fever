package com.concertfever.concertfever_backend.repository;

import com.concertfever.concertfever_backend.dto.TicketCategoryDto;
import com.concertfever.concertfever_backend.entities.TicketCategory;
import com.concertfever.concertfever_backend.entities.TicketCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCategoryRepository extends JpaRepository<TicketCategory, TicketCategoryId> {

        @Query("SELECT new com.concertfever.concertfever_backend.dto.TicketCategoryDto(tc.ticketCategoryId.ticketCategory, tc.price, tc.totalQuantity, tc.remainingQuantity) FROM TicketCategory tc WHERE tc.eventId.eventId = :eventId")
        List<TicketCategoryDto> findTicketCategoriesByEventId(@Param("eventId") Integer eventId);
}