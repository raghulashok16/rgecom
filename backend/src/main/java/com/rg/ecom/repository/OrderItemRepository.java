package com.rg.ecom.repository;

import com.rg.ecom.dto.analytics.SupplierPerformanceDTO;
import com.rg.ecom.entity.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            SELECT new com.rg.ecom.dto.analytics.SupplierPerformanceDTO(
                p.supplier.id,
                p.supplier.name,
                SUM(oi.price * oi.quantity),
                COUNT(DISTINCT oi.order.id),
                SUM(oi.quantity)
            )
            FROM OrderItem oi
            JOIN oi.product p
            JOIN oi.order o
            WHERE o.status <> com.rg.ecom.entity.order.OrderStatus.CANCELLED
            AND o.orderedAt >= :start
            AND o.orderedAt < :end
            AND p.supplier IS NOT NULL
            GROUP BY p.supplier.id, p.supplier.name
            """)
    List<SupplierPerformanceDTO> findSupplierPerformance(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
