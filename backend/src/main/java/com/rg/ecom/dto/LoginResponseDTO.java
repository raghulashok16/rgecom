package com.rg.ecom.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LoginResponseDTO {

    private String token;
    private String username;
    private List<String> roles;
}
