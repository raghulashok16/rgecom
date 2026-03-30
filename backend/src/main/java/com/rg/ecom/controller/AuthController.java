package com.rg.ecom.controller;

import com.rg.ecom.dto.LoginRequestDTO;
import com.rg.ecom.dto.LoginResponseDTO;
import com.rg.ecom.dto.RegisterRequestDTO;
import com.rg.ecom.dto.RegisterResponseDTO;
import com.rg.ecom.dto.UserDTO;
import com.rg.ecom.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        RegisterResponseDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<List<UserDTO>> getUsersByName(@RequestParam String name) {
        return ResponseEntity.ok(authService.getUsersByName(name));
    }

    @GetMapping("/users/filter")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<List<UserDTO>> getUsersByFilter(
            @RequestParam String role,
            @RequestParam(required = false) Boolean active) {
        return ResponseEntity.ok(authService.getUsersByFilter(role, active));
    }

    @PatchMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        boolean active = (Boolean) body.get("active");
        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) body.get("roles");
        return ResponseEntity.ok(authService.updateUser(id, active, roles));
    }

    @DeleteMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAllUsers() {
        authService.deleteAllUsers();
        return ResponseEntity.noContent().build();
    }
}
