package com.rg.ecom.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateInventoryDTO {

    @Min(value = 0, message = "Quantity cannot be negative")
    private Long quantity;

    private String warehouseLocation;
}
