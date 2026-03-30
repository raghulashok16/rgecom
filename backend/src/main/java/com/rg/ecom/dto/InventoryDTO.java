package com.rg.ecom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Long quantity;
    private String warehouseLocation;
    private LocalDateTime lastUpdated;
}
