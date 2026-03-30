package com.rg.ecom.seeder;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/seeder")
@RequiredArgsConstructor
public class SeederController {

    private final DataSeederService dataSeederService;

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runSeeder() {
        SeederResult result = dataSeederService.seed();
        return ResponseEntity.ok(Map.of(
                "message", "Database seeded successfully",
                "suppliersCreated", result.getSuppliersCreated(),
                "categoriesCreated", result.getCategoriesCreated(),
                "productsCreated", result.getProductsCreated(),
                "ordersCreated", result.getOrdersCreated()
        ));
    }

    @PostMapping("/orders")
    public ResponseEntity<Map<String, Object>> seedOrders() {
        int count = dataSeederService.seedOrders();
        if (count == 0) {
            return ResponseEntity.ok(Map.of("message", "Orders already seeded or products/users not found", "ordersCreated", 0));
        }
        return ResponseEntity.ok(Map.of("message", "Orders seeded successfully", "ordersCreated", count));
    }
}
