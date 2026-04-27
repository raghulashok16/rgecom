package com.rg.ecom.dto;

import com.rg.ecom.entity.order.MovementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementDTO {
    private Long id;
    private Long productId;
    private MovementType movementType;
    private Long quantity;
    private String referenceType;
    private Long referenceId;
    private LocalDateTime movementDate;
}
