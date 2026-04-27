package com.rg.ecom.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSupplierDTO {
    @NotBlank(message = "Name is required")
    private String name;
    private String contactPerson;
    private String phone;
    @Email(message = "Invalid email format")
    private String email;
    private String address;
}