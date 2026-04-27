package com.rg.ecom.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    private String customerName;
    private String customerEmail;

    @Valid
    @NotEmpty(message = "items must not be null or empty")
    private List<OrderItemRequest> items;
}
