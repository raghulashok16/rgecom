package com.rg.ecom.service;

import com.rg.ecom.entity.auth.Role;
import com.rg.ecom.entity.auth.User;
import com.rg.ecom.entity.auth.UserRole;
import com.rg.ecom.entity.product.Category;
import com.rg.ecom.entity.product.Product;
import com.rg.ecom.entity.product.Supplier;
import com.rg.ecom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.getUsername().equals("raghul"))
                .map(user -> Map.<String, Object>of(
                        "id",       user.getId(),
                        "username", user.getUsername(),
                        "email",    user.getEmail(),
                        "active",   user.isActive()
                ))
                .toList();
    }

    @Transactional
    public Map<String, Object> setUserRoles(Long userId, List<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        userRoleRepository.deleteByUser(user);

        List<String> assigned = roleNames.stream().map(roleName -> {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found: " + roleName));
            userRoleRepository.save(UserRole.builder().user(user).role(role).build());
            return roleName;
        }).toList();

        return Map.of("userId", userId, "username", user.getUsername(), "rolesAssigned", assigned);
    }

    @Transactional
    public Map<String, Object> setUserActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setActive(active);
        userRepository.save(user);
        return Map.of("userId", userId, "username", user.getUsername(), "active", active);
    }

    @Transactional
    public Map<String, Object> setProductActive(Long productId, boolean active) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setActive(active);
        productRepository.save(product);
        return Map.of("productId", productId, "name", product.getName(), "active", active);
    }

    @Transactional
    public Map<String, Object> setCategoryActive(Long categoryId, boolean active) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setActive(active);
        categoryRepository.save(category);
        return Map.of("categoryId", categoryId, "name", category.getName(), "active", active);
    }

    @Transactional
    public Map<String, Object> setSupplierActive(Long supplierId, boolean active) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
        supplier.setActive(active);
        supplierRepository.save(supplier);
        return Map.of("supplierId", supplierId, "name", supplier.getName(), "active", active);
    }
}
