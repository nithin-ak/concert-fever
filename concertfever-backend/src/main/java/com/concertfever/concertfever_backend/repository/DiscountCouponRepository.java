package com.concertfever.concertfever_backend.repository;

import com.concertfever.concertfever_backend.entities.DiscountCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountCouponRepository extends JpaRepository<DiscountCoupon, Integer> {
}