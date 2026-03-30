package com.rg.ecom.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private boolean active;
    private LocalDateTime createdAt;
}
