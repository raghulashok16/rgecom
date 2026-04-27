package com.rg.ecom.controller;

import com.rg.ecom.dto.InventoryDTO;
import com.rg.ecom.dto.StockAdjustmentRequest;
import com.rg.ecom.dto.StockMovementDTO;
import com.rg.ecom.dto.UpdateInventoryDTO;
import com.rg.ecom.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<List<InventoryDTO>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @GetMapping("/movements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StockMovementDTO>> getAllMovements() {
        return ResponseEntity.ok(inventoryService.getAllMovements());
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK') or hasRole('SUPPLIER')")
    public ResponseEntity<InventoryDTO> getByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getByProductId(productId));
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<InventoryDTO> updateStock(
            @PathVariable Long productId,
            @Valid @RequestBody UpdateInventoryDTO dto) {
        return ResponseEntity.ok(inventoryService.updateStock(productId, dto));
    }

    @PostMapping("/{productId}/adjust")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK') or hasRole('SUPPLIER')")
    public ResponseEntity<InventoryDTO> adjustStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.ok(inventoryService.adjustStock(productId, request));
    }

    @GetMapping("/{productId}/movements")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK') or hasRole('SUPPLIER')")
    public ResponseEntity<List<StockMovementDTO>> getMovements(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getMovementsByProduct(productId));
    }
}
