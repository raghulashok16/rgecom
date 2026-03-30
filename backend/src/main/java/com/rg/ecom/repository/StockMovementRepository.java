package com.rg.ecom.repository;

import com.rg.ecom.entity.order.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductIdOrderByMovementDateDesc(Long productId);
    List<StockMovement> findAllByOrderByMovementDateDesc();
}
