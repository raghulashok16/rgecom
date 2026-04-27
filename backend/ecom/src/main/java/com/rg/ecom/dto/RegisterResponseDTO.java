package com.rg.ecom.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RegisterResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
}
