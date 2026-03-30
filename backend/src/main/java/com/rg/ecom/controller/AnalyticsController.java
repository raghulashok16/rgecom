package com.rg.ecom.controller;

import com.rg.ecom.dto.analytics.SupplierPerformanceDTO;
import com.rg.ecom.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/supplier-performance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMIN_STOCK')")
    public ResponseEntity<List<SupplierPerformanceDTO>> getSupplierPerformance(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(analyticsService.getSupplierPerformance(month, year));
    }
}
