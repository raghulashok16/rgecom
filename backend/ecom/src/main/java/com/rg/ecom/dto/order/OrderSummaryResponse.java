package com.rg.ecom.dto.order;

import com.rg.ecom.entity.order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSummaryResponse {
    private Long id;
    private String orderNumber;
    private String username;
    private String firstItemName;
    private int extraItemsCount;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String orderedAt;
    private OrderTimeline timeline;
}
