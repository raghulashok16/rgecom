package com.rg.ecom.controller;

import com.rg.ecom.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // --- Users ---

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/roles")
    public ResponseEntity<Map<String, Object>> setUserRoles(
            @PathVariable Long userId,
            @RequestBody Map<String, List<String>> body) {
        List<String> roles = body.get("roles");
        return ResponseEntity.ok(adminService.setUserRoles(userId, roles));
    }

    @PutMapping("/users/{userId}/active")
    public ResponseEntity<Map<String, Object>> setUserActive(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(adminService.setUserActive(userId, body.get("active")));
    }

    // --- Products ---

    @PutMapping("/products/{productId}/active")
    public ResponseEntity<Map<String, Object>> setProductActive(
            @PathVariable Long productId,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(adminService.setProductActive(productId, body.get("active")));
    }

    // --- Categories ---

    @PutMapping("/categories/{categoryId}/active")
    public ResponseEntity<Map<String, Object>> setCategoryActive(
            @PathVariable Long categoryId,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(adminService.setCategoryActive(categoryId, body.get("active")));
    }

    // --- Suppliers ---

    @PutMapping("/suppliers/{supplierId}/active")
    public ResponseEntity<Map<String, Object>> setSupplierActive(
            @PathVariable Long supplierId,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(adminService.setSupplierActive(supplierId, body.get("active")));
    }
}
