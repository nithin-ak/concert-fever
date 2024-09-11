package com.concertfever.concertfever_backend.repository;

import com.concertfever.concertfever_backend.entities.UserConfidential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserConfidentialRepository extends JpaRepository<UserConfidential, Integer> {
}