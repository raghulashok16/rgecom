package com.rg.ecom.service;

import com.rg.ecom.dto.analytics.SupplierPerformanceDTO;
import com.rg.ecom.repository.OrderItemRepository;
import com.rg.ecom.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderItemRepository orderItemRepository;
    private final SupplierRepository supplierRepository;

    public List<SupplierPerformanceDTO> getSupplierPerformance(int month, int year) {
        LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime end   = start.plusMonths(1);

        Map<Long, SupplierPerformanceDTO> resultMap = orderItemRepository
                .findSupplierPerformance(start, end)
                .stream()
                .collect(Collectors.toMap(SupplierPerformanceDTO::getSupplierId, dto -> dto));

        // Include all suppliers, even those with zero sales this month
        supplierRepository.findAll().forEach(supplier -> {
            if (!resultMap.containsKey(supplier.getId())) {
                resultMap.put(supplier.getId(), SupplierPerformanceDTO.builder()
                        .supplierId(supplier.getId())
                        .supplierName(supplier.getName())
                        .totalRevenue(BigDecimal.ZERO)
                        .totalOrders(0L)
                        .totalItems(0L)
                        .build());
            }
        });

        return resultMap.values().stream()
                .sorted(Comparator.comparing(SupplierPerformanceDTO::getTotalRevenue).reversed())
                .collect(Collectors.toList());
    }
}
