package com.rg.ecom.controller;

import com.rg.ecom.dto.CreateProductDTO;
import com.rg.ecom.dto.PagedResponse;
import com.rg.ecom.dto.ProductWithDetailsDTO;
import com.rg.ecom.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductWithDetailsDTO> createProduct(@Valid @RequestBody CreateProductDTO dto) {
        ProductWithDetailsDTO response = productService.createProduct(dto, true);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/supplier")
    @PreAuthorize("hasRole('SUPPLIER')")
    public ResponseEntity<ProductWithDetailsDTO> createProductAsSupplier(
            @Valid @RequestBody CreateProductDTO dto,
            Authentication authentication) {
        ProductWithDetailsDTO response = productService.createProductAsSupplier(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ProductWithDetailsDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort) {
        PagedResponse<ProductWithDetailsDTO> products = productService.getAllProducts(page, size, sort);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/supplier")
    public ResponseEntity<PagedResponse<ProductWithDetailsDTO>> getProductsBySupplier(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort) {
        PagedResponse<ProductWithDetailsDTO> products = productService.getProductsBySupplier(
                authentication.getName(), page, size, sort);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ProductWithDetailsDTO>> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort) {
        PagedResponse<ProductWithDetailsDTO> products = productService.searchProducts(name, page, size, sort);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<PagedResponse<ProductWithDetailsDTO>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort) {
        PagedResponse<ProductWithDetailsDTO> products = productService.getProductsByCategory(categoryId, page, size, sort);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductWithDetailsDTO> getProductById(@PathVariable Long id) {
        ProductWithDetailsDTO response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK') or hasRole('SUPPLIER')")
    public ResponseEntity<ProductWithDetailsDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody CreateProductDTO dto) {
        ProductWithDetailsDTO response = productService.updateProduct(id, dto);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
