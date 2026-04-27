package com.rg.ecom.repository;

import com.rg.ecom.entity.order.Order;
import com.rg.ecom.entity.order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(Long userId);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Page<Order> findByOrderedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<Order> findByStatusAndOrderedAtBetween(OrderStatus status, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
