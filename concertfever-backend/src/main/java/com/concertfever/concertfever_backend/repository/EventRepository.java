package com.concertfever.concertfever_backend.repository;

import com.concertfever.concertfever_backend.entities.Category;
import com.concertfever.concertfever_backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    List<Event> findEventByCategory(Category category);
}