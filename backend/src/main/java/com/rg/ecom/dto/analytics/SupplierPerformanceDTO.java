package com.rg.ecom.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierPerformanceDTO {
    private Long supplierId;
    private String supplierName;
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalItems;

}
