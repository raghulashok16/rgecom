package com.rg.ecom.dto;

import com.rg.ecom.entity.product.Category;
import com.rg.ecom.entity.product.Supplier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Category category;

    private Supplier supplier;

    private LocalDateTime createdAt;
}
