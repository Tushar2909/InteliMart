package com.intellimart.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.ProductDto;
import com.intellimart.entities.Product;
import com.intellimart.entities.ProductCategory;
import com.intellimart.entities.Seller;
import com.intellimart.entities.User;
import com.intellimart.repos.ProductRepo;
import com.intellimart.repos.SellerRepo;
import com.intellimart.repos.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductServiceImpl implements ProductServiceInterface {

    private final ProductRepo productRepo;
    private final SellerRepo sellerRepo;
    private final UserRepo userRepo;

    @Override
    public List<ProductDto> getAllProducts(int page, int size) {

        return productRepo.findAllByIsDeletedFalse(PageRequest.of(page, size))
                .getContent()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ProductDto getProductById(Long id) {

        Product product = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return toDto(product);
    }

    // ================= CREATE =================

    @Override
    public ProductDto addProduct(Authentication auth, ProductDto dto) {

        Seller seller = getSellerFromAuth(auth);

        Product p = new Product();
        p.setName(dto.getName());
        p.setPcategory(dto.getPcategory());
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setImageUrl(dto.getImageUrl());
        p.setDescription(dto.getDescription());
        p.setSeller(seller);
        p.setDeleted(false);

        Product saved = productRepo.save(p);

        log.info("Product created {}", saved.getId());

        return toDto(saved);
    }

    // ================= UPDATE =================

    @Override
    public ProductDto updateProduct(Authentication auth, Long id, ProductDto dto) {

        Product p = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        validateOwnership(auth, p);

        p.setName(dto.getName());
        p.setPcategory(dto.getPcategory());
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setImageUrl(dto.getImageUrl());
        p.setDescription(dto.getDescription());

        return toDto(productRepo.save(p));
    }

    // ================= DELETE =================

    @Override
    public String deleteProduct(Authentication auth, Long id) {

        Product p = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        validateOwnership(auth, p);

        p.setDeleted(true);
        productRepo.save(p);

        return "Product deleted successfully";
    }

    // ================= CATEGORY =================

    @Override
    public List<ProductDto> getProductsByCategory(ProductCategory category) {

        return productRepo.findByPcategoryAndIsDeletedFalse(category)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ================= SELLER INVENTORY =================

    @Override
    public List<ProductDto> getSellerProducts(Authentication auth) {

        Seller seller = getSellerFromAuth(auth);

        return productRepo.findBySeller_IdAndIsDeletedFalse(seller.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ================= HELPERS =================

    private Seller getSellerFromAuth(Authentication auth) {

        String email = auth.getName();

        User user = userRepo.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sellerRepo.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));
    }

    private void validateOwnership(Authentication auth, Product p) {

        // ADMIN bypass
        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return;
        }

        Seller seller = getSellerFromAuth(auth);

        if (p.getSeller() == null || !p.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You cannot modify another seller's product");
        }
    }

    // ✅ NULL SAFE DTO
    private ProductDto toDto(Product p) {

        ProductDto dto = new ProductDto();

        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPcategory(p.getPcategory());
        dto.setPrice(p.getPrice());
        dto.setUnitsAvailable(p.getUnitsAvailable());
        dto.setImageUrl(p.getImageUrl());
        dto.setDescription(p.getDescription());

        if (p.getSeller() != null) {
            dto.setSellerId(p.getSeller().getId());
        }

        return dto;
    }
}
