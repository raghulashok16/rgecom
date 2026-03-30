package com.rg.ecom.dto.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTimeline {
    private String orderedAt;
    private String paymentAt;
    private String confirmationAt;
    private String deliveryAt;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String cancelledAt;
}
