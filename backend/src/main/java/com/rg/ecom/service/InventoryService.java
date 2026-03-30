package com.rg.ecom.service;

import com.rg.ecom.dto.InventoryDTO;
import com.rg.ecom.dto.StockAdjustmentRequest;
import com.rg.ecom.dto.StockMovementDTO;
import com.rg.ecom.dto.UpdateInventoryDTO;
import com.rg.ecom.entity.inventory.Inventory;
import com.rg.ecom.entity.order.MovementType;
import com.rg.ecom.entity.order.StockMovement;
import com.rg.ecom.entity.product.Product;
import com.rg.ecom.exception.ResourceNotFoundException;
import com.rg.ecom.repository.InventoryRepository;
import com.rg.ecom.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;

    @Transactional
    public void createInitialInventory(Product product) {
        if (!inventoryRepository.existsByProduct_Id(product.getId())) {
            inventoryRepository.save(Inventory.builder()
                    .product(product)
                    .quantity(0L)
                    .build());
        }
    }

    public List<InventoryDTO> getAll() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public InventoryDTO getByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product id: " + productId));
        return mapToDTO(inventory);
    }

    @Transactional
    public InventoryDTO updateStock(Long productId, UpdateInventoryDTO dto) {
        Inventory inventory = inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product id: " + productId));

        if (dto.getQuantity() != null) {
            inventory.setQuantity(dto.getQuantity());
        }
        if (dto.getWarehouseLocation() != null) {
            inventory.setWarehouseLocation(dto.getWarehouseLocation());
        }

        return mapToDTO(inventoryRepository.save(inventory));
    }

    @Transactional
    public InventoryDTO adjustStock(Long productId, StockAdjustmentRequest request) {
        Inventory inventory = inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product id: " + productId));

        long newQuantity;
        if (request.getMovementType() == MovementType.IN) {
            if (request.getQuantity() < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1 for Inward movement");
            }
            newQuantity = inventory.getQuantity() + request.getQuantity();
        } else if (request.getMovementType() == MovementType.OUT) {
            if (request.getQuantity() < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1 for Outward movement");
            }
            if (inventory.getQuantity() < request.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + inventory.getQuantity());
            }
            newQuantity = inventory.getQuantity() - request.getQuantity();
        } else {
            newQuantity = request.getQuantity();
        }

        stockMovementRepository.save(StockMovement.builder()
                .productId(productId)
                .movementType(request.getMovementType())
                .quantity(request.getQuantity())
                .referenceType(request.getMovementType() == MovementType.IN ? "RESTOCK" : "ADJUSTMENT")
                .build());

        inventory.setQuantity(newQuantity);
        Inventory saved = inventoryRepository.save(inventory);

        return mapToDTO(saved);
    }

    public List<StockMovementDTO> getAllMovements() {
        return stockMovementRepository.findAllByOrderByMovementDateDesc().stream()
                .map(m -> StockMovementDTO.builder()
                        .id(m.getId())
                        .productId(m.getProductId())
                        .movementType(m.getMovementType())
                        .quantity(m.getQuantity())
                        .referenceType(m.getReferenceType())
                        .referenceId(m.getReferenceId())
                        .movementDate(m.getMovementDate())
                        .build())
                .toList();
    }

    public List<StockMovementDTO> getMovementsByProduct(Long productId) {
        return stockMovementRepository.findByProductIdOrderByMovementDateDesc(productId).stream()
                .map(m -> StockMovementDTO.builder()
                        .id(m.getId())
                        .productId(m.getProductId())
                        .movementType(m.getMovementType())
                        .quantity(m.getQuantity())
                        .referenceType(m.getReferenceType())
                        .referenceId(m.getReferenceId())
                        .movementDate(m.getMovementDate())
                        .build())
                .toList();
    }

    private InventoryDTO mapToDTO(Inventory inventory) {
        return InventoryDTO.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .quantity(inventory.getQuantity())
                .warehouseLocation(inventory.getWarehouseLocation())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}
