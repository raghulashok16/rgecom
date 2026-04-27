package com.rg.ecom.entity.inventory;

import com.rg.ecom.entity.product.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "low_stock_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LowStockAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Long threshold;

    @CreationTimestamp
    @Column(name = "triggered_at", updatable = false)
    private LocalDateTime triggeredAt;

    @Column(name = "admin_seen")
    private LocalDateTime adminSeen;
}
