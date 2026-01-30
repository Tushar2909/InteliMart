package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.intellimart.dto.ApiResponse;
import com.intellimart.dto.ProductDto;
import com.intellimart.service.ProductServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceInterface productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(productService.getAllProducts(page, size));
    }

    // SELLER + ADMIN CREATE (multipart)
    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addProduct(Authentication auth,
            @RequestPart("data") ProductDto dto,
            @RequestPart("image") MultipartFile image) {

        return ResponseEntity.ok(productService.addProduct(auth, dto, image));
    }

    // SELLER + ADMIN UPDATE (multipart)
    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @PutMapping(value="/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProduct(Authentication auth,
            @PathVariable Long id,
            @RequestPart("data") ProductDto dto,
            @RequestPart(value="image", required=false) MultipartFile image) {

        return ResponseEntity.ok(productService.updateProduct(auth, id, dto, image));
    }

    // ADMIN JSON UPDATE (Dashboard)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductAdminJson(@PathVariable Long id,@RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProductByAdmin(id, dto));
    }

    // ADMIN DELETE
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, productService.deleteProductByAdmin(id)));
    }
}
