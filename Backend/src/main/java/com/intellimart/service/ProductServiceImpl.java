package com.intellimart.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.ProductDto;
import com.intellimart.entities.Product;
import com.intellimart.entities.Seller;
import com.intellimart.repos.ProductRepo;
import com.intellimart.repos.SellerRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductServiceInterface {

    private final ProductRepo productRepo;
    private final SellerRepo sellerRepo;

    // ================= GET ALL PRODUCTS =================

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {

        return productRepo.findAllByIsDeletedFalse()
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ================= GET PRODUCT BY ID =================

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {

        Product product = productRepo.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return toDto(product);
    }

    // ================= ADD PRODUCT =================

    @Override
    public ProductDto addProduct(ProductDto dto) {

        Seller seller = sellerRepo.findById(dto.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product p = new Product();

        p.setName(dto.getName());
        p.setPcategory(dto.getPcategory());
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setImageUrl(dto.getImageUrl());
        p.setSeller(seller);
        p.setDeleted(false);

        return toDto(productRepo.save(p));
    }

    // ================= UPDATE PRODUCT =================

    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) {

        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        p.setName(dto.getName());
        p.setPcategory(dto.getPcategory());
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setImageUrl(dto.getImageUrl());

        return toDto(productRepo.save(p));
    }

    // ================= DELETE PRODUCT (SOFT) =================

    @Override
    public String deleteProduct(Long id) {

        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        p.setDeleted(true);
        productRepo.save(p);

        return "Product deleted successfully";
    }

    // ================= DTO MAPPER =================

    private ProductDto toDto(Product p) {

        ProductDto dto = new ProductDto();

        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPcategory(p.getPcategory());
        dto.setPrice(p.getPrice());
        dto.setUnitsAvailable(p.getUnitsAvailable());
        dto.setImageUrl(p.getImageUrl());

        if (p.getSeller() != null) {
            dto.setSellerId(p.getSeller().getId());
        }

        return dto;
    }
}
