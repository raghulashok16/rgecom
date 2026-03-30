package com.rg.ecom.repository;

import com.rg.ecom.entity.inventory.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProduct_Id(Long productId);
    boolean existsByProduct_Id(Long productId);
}
