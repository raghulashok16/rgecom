package com.rg.ecom.service;

import com.rg.ecom.dto.CreateSupplierDTO;
import com.rg.ecom.dto.SupplierResponseDTO;
import com.rg.ecom.entity.product.Supplier;
import com.rg.ecom.exception.ResourceNotFoundException;
import com.rg.ecom.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierResponseDTO createSupplier(CreateSupplierDTO dto) {
        Supplier supplier = Supplier.builder()
                .name(dto.getName())
                .contactPerson(dto.getContactPerson())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .build();

        Supplier savedSupplier = supplierRepository.save(supplier);
        return mapToResponseDTO(savedSupplier);
    }

    public SupplierResponseDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        return mapToResponseDTO(supplier);
    }

    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public SupplierResponseDTO updateSupplier(Long id, CreateSupplierDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhone(dto.getPhone());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return mapToResponseDTO(updatedSupplier);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        supplierRepository.delete(supplier);
    }

    private SupplierResponseDTO mapToResponseDTO(Supplier supplier) {
        return SupplierResponseDTO.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactPerson(supplier.getContactPerson())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .createdAt(supplier.getCreatedAt())
                .build();
    }
}