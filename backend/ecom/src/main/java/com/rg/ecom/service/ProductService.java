package com.rg.ecom.service;

import com.rg.ecom.dto.CreateProductDTO;
import com.rg.ecom.dto.PagedResponse;
import com.rg.ecom.dto.ProductWithDetailsDTO;
import com.rg.ecom.entity.product.Category;
import com.rg.ecom.entity.product.Product;
import com.rg.ecom.entity.product.Supplier;
import com.rg.ecom.exception.ResourceNotFoundException;
import com.rg.ecom.repository.CategoryRepository;
import com.rg.ecom.repository.ProductRepository;
import com.rg.ecom.repository.SupplierRepository;
import com.rg.ecom.repository.InventoryRepository;
import com.rg.ecom.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;
    private final InventoryRepository inventoryRepository;

    @Transactional
    public ProductWithDetailsDTO createProduct(CreateProductDTO dto, boolean active) {
        Category category = null;
        Supplier supplier = null;

        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
        }

        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));
        }

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(category)
                .supplier(supplier)
                .imageUrl(dto.getImageUrl())
                .active(active)
                .build();

        Product savedProduct = productRepository.save(product);
        inventoryService.createInitialInventory(savedProduct);
        return mapToWithDetailsDTO(savedProduct);
    }

    @Transactional
    public ProductWithDetailsDTO createProductAsSupplier(CreateProductDTO dto, String username) {
        String email = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username))
                .getEmail();
        Supplier supplier = supplierRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No supplier account linked to user: " + username));

        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
        }

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(category)
                .supplier(supplier)
                .imageUrl(dto.getImageUrl())
                .active(false)
                .build();

        Product savedProduct = productRepository.save(product);
        inventoryService.createInitialInventory(savedProduct);
        return mapToWithDetailsDTO(savedProduct);
    }

    public ProductWithDetailsDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToWithDetailsDTO(product);
    }

    public PagedResponse<ProductWithDetailsDTO> getAllProducts(int page, int size, String sort) {
        if (!"asc".equalsIgnoreCase(sort) && !"desc".equalsIgnoreCase(sort)) {
            throw new IllegalArgumentException("Invalid sort direction. Use 'asc' or 'desc'");
        }
        Sort.Direction direction = "desc".equalsIgnoreCase(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "price"));
        Page<ProductWithDetailsDTO> p = productRepository.findAll(pageable)
            .map(this::mapToWithDetailsDTO);
        return PagedResponse.<ProductWithDetailsDTO>builder()
            .content(p.getContent())
            .totalPages(p.getTotalPages())
            .totalElements(p.getTotalElements())
            .size(p.getSize())
            .numberOfElements(p.getNumberOfElements())
            .build();
    }

    public PagedResponse<ProductWithDetailsDTO> getProductsByCategory(Long categoryId, int page, int size, String sort) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        if (!"asc".equalsIgnoreCase(sort) && !"desc".equalsIgnoreCase(sort)) {
            throw new IllegalArgumentException("Invalid sort direction. Use 'asc' or 'desc'");
        }
        Sort.Direction direction = "desc".equalsIgnoreCase(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "price"));
        Page<ProductWithDetailsDTO> p = productRepository.findAllByCategory_Id(categoryId, pageable)
                .map(this::mapToWithDetailsDTO);
        return PagedResponse.<ProductWithDetailsDTO>builder()
                .content(p.getContent())
                .totalPages(p.getTotalPages())
                .totalElements(p.getTotalElements())
                .size(p.getSize())
                .numberOfElements(p.getNumberOfElements())
                .build();
    }

    public PagedResponse<ProductWithDetailsDTO> searchProducts(String name, int page, int size, String sort) {
        if (!"asc".equalsIgnoreCase(sort) && !"desc".equalsIgnoreCase(sort)) {
            throw new IllegalArgumentException("Invalid sort direction. Use 'asc' or 'desc'");
        }
        Sort.Direction direction = "desc".equalsIgnoreCase(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "price"));
        Page<ProductWithDetailsDTO> p = productRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(this::mapToWithDetailsDTO);
        return PagedResponse.<ProductWithDetailsDTO>builder()
                .content(p.getContent())
                .totalPages(p.getTotalPages())
                .totalElements(p.getTotalElements())
                .size(p.getSize())
                .numberOfElements(p.getNumberOfElements())
                .build();
    }

    public PagedResponse<ProductWithDetailsDTO> getProductsBySupplier(String username, int page, int size, String sort) {
        if (!"asc".equalsIgnoreCase(sort) && !"desc".equalsIgnoreCase(sort)) {
            throw new IllegalArgumentException("Invalid sort direction. Use 'asc' or 'desc'");
        }
        String email = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username))
                .getEmail();
        Supplier supplier = supplierRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No supplier account linked to user: " + username));
        Sort.Direction direction = "desc".equalsIgnoreCase(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "price"));
        Page<ProductWithDetailsDTO> p = productRepository.findBySupplier_Id(supplier.getId(), pageable)
                .map(this::mapToWithDetailsDTO);
        return PagedResponse.<ProductWithDetailsDTO>builder()
                .content(p.getContent())
                .totalPages(p.getTotalPages())
                .totalElements(p.getTotalElements())
                .size(p.getSize())
                .numberOfElements(p.getNumberOfElements())
                .build();
    }

    public ProductWithDetailsDTO updateProduct(Long id, CreateProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));
            product.setSupplier(supplier);
        } else {
            product.setSupplier(null);
        }

        if (dto.getActive() != null) {
            product.setActive(dto.getActive());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToWithDetailsDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        inventoryRepository.findByProduct_Id(id).ifPresent(inventoryRepository::delete);
        productRepository.delete(product);
    }

    private ProductWithDetailsDTO mapToWithDetailsDTO(Product product) {
        Long stock = inventoryRepository.findByProduct_Id(product.getId())
                .map(inv -> inv.getQuantity())
                .orElse(null);
        return ProductWithDetailsDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .supplierId(product.getSupplier() != null ? product.getSupplier().getId() : null)
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .active(product.isActive())
                .stockQuantity(stock)
                .build();
    }

}
