package com.intellimart.service;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import com.intellimart.dto.ProductDto;
import com.intellimart.entities.ProductCategory;

public interface ProductServiceInterface {
    // Standard Retrieval Methods
    List<ProductDto> getAllProducts(int page, int size);
    List<ProductDto> getProductsByCategory(ProductCategory category);
    ProductDto getProductById(Long id);
    
    // Search Implementation
    List<ProductDto> searchProducts(String query);

    // Seller Operation Methods
    ProductDto addProduct(Authentication auth, ProductDto dto, MultipartFile image);
    ProductDto updateProduct(Authentication auth, Long id, ProductDto dto, MultipartFile image);
    String deleteProduct(Authentication auth, Long id);
    List<ProductDto> getSellerProducts(Authentication auth);

    // ================= ADMIN OPERATIONS =================
    // Supports multipart/form-data for the Admin Dashboard Image choosing
    ProductDto updateProductByAdmin(Long id, ProductDto dto, MultipartFile image);
    String deleteProductByAdmin(Long id);
}