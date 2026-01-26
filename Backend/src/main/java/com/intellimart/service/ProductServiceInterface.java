package com.intellimart.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.intellimart.dto.ProductDto;
import com.intellimart.entities.ProductCategory;

public interface ProductServiceInterface {

    List<ProductDto> getAllProducts(int page, int size);

    ProductDto getProductById(Long id);

    ProductDto addProduct(Authentication auth, ProductDto productDto);

    ProductDto updateProduct(Authentication auth, Long id, ProductDto dto);

    String deleteProduct(Authentication auth, Long id);

    List<ProductDto> getProductsByCategory(ProductCategory category);

    // ✅ SELLER INVENTORY
    List<ProductDto> getSellerProducts(Authentication auth);
}
