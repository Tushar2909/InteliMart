package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.ProductDto;
import com.intellimart.entities.ProductCategory;
import com.intellimart.service.ProductServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceInterface productService;

    // PUBLIC catalog
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(productService.getAllProducts(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDto>> getByCategory(
            @PathVariable ProductCategory category) {

        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    // ✅ SELLER ONLY – own products
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    @GetMapping("/my")
    public ResponseEntity<List<ProductDto>> myProducts(Authentication auth) {

        return ResponseEntity.ok(productService.getSellerProducts(auth));
    }

    // CREATE
    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDto> addProduct(Authentication auth,
                                                 @RequestBody ProductDto dto) {

        return ResponseEntity.ok(productService.addProduct(auth, dto));
    }

    // UPDATE
    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(Authentication auth,
                                                    @PathVariable Long id,
                                                    @RequestBody ProductDto dto) {

        return ResponseEntity.ok(productService.updateProduct(auth, id, dto));
    }

    // DELETE
    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(Authentication auth,
                                                @PathVariable Long id) {

        return ResponseEntity.ok(productService.deleteProduct(auth, id));
    }
}
