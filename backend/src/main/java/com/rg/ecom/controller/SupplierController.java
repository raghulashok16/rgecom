package com.rg.ecom.controller;

import com.rg.ecom.dto.CreateSupplierDTO;
import com.rg.ecom.dto.SupplierResponseDTO;
import com.rg.ecom.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<SupplierResponseDTO> createSupplier(@Valid @RequestBody CreateSupplierDTO dto) {
        SupplierResponseDTO response = supplierService.createSupplier(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> getSupplierById(@PathVariable Long id) {
        SupplierResponseDTO response = supplierService.getSupplierById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SupplierResponseDTO>> getAllSuppliers() {
        List<SupplierResponseDTO> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(@PathVariable Long id, @Valid @RequestBody CreateSupplierDTO dto) {
        SupplierResponseDTO response = supplierService.updateSupplier(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
