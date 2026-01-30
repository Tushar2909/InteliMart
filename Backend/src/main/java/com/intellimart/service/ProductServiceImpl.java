package com.intellimart.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.intellimart.dto.ProductDto;
import com.intellimart.entities.Product;
import com.intellimart.entities.ProductCategory;
import com.intellimart.entities.Seller;
import com.intellimart.entities.User;
import com.intellimart.repos.ProductRepo;
import com.intellimart.repos.SellerRepo;
import com.intellimart.repos.UserRepo;

import lombok.RequiredArgsConstructor;

//(unchanged imports)

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductServiceInterface {

 private final ProductRepo productRepo;
 private final SellerRepo sellerRepo;
 private final UserRepo userRepo;
 private final Cloudinary cloudinary;

 @Override
 public List<ProductDto> getAllProducts(int page, int size) {
     return productRepo.findAllByIsDeletedFalse(PageRequest.of(page, size))
             .getContent().stream().map(this::toDto).toList();
 }

 @Override
 public List<ProductDto> getProductsByCategory(ProductCategory category) {
     return productRepo.findByPcategoryAndIsDeletedFalse(category)
             .stream().map(this::toDto).toList();
 }

 @Override
 public ProductDto getProductById(Long id) {
     Product product = productRepo.findByIdAndIsDeletedFalse(id)
             .orElseThrow(() -> new RuntimeException("Product not found"));
     return toDto(product);
 }

 // ================= SELLER =================

 @Override
 public ProductDto addProduct(Authentication auth, ProductDto dto, MultipartFile image) {

     Seller seller = getSellerFromAuth(auth);
     String imageUrl = uploadToCloudinary(image);

     Product p = new Product();
     p.setName(dto.getName());
     p.setPcategory(ProductCategory.valueOf(dto.getPcategory()));
     p.setPrice(dto.getPrice());
     p.setUnitsAvailable(dto.getUnitsAvailable());
     p.setDescription(dto.getDescription());
     p.setSeller(seller);
     p.setDeleted(false);
     p.setImageUrl(imageUrl);

     return toDto(productRepo.save(p));
 }

 @Override
 public ProductDto updateProduct(Authentication auth, Long id, ProductDto dto, MultipartFile image) {

     Product p = productRepo.findByIdAndIsDeletedFalse(id)
             .orElseThrow(() -> new RuntimeException("Product not found"));

     validateOwnership(auth, p);

     p.setName(dto.getName());
     p.setPcategory(ProductCategory.valueOf(dto.getPcategory()));
     p.setPrice(dto.getPrice());
     p.setUnitsAvailable(dto.getUnitsAvailable());
     p.setDescription(dto.getDescription());

     if (image != null && !image.isEmpty())
         p.setImageUrl(uploadToCloudinary(image));

     return toDto(productRepo.save(p));
 }

 @Override
 public String deleteProduct(Authentication auth, Long id) {

     Product p = productRepo.findByIdAndIsDeletedFalse(id)
             .orElseThrow(() -> new RuntimeException("Product not found"));

     validateOwnership(auth, p);
     p.setDeleted(true);
     productRepo.save(p);
     return "Product deleted";
 }

 @Override
 public List<ProductDto> getSellerProducts(Authentication auth) {

     Seller seller = getSellerFromAuth(auth);

     return productRepo.findBySeller_IdAndIsDeletedFalse(seller.getId())
             .stream().map(this::toDto).toList();
 }

 // ================= ADMIN =================

 @Override
 public ProductDto updateProductByAdmin(Long id, ProductDto dto) {

     Product p = productRepo.findById(id)
             .orElseThrow(() -> new RuntimeException("Product not found"));

     p.setName(dto.getName());
     p.setPcategory(ProductCategory.valueOf(dto.getPcategory()));
     p.setPrice(dto.getPrice());
     p.setUnitsAvailable(dto.getUnitsAvailable());
     p.setDescription(dto.getDescription());

     return toDto(productRepo.save(p));
 }

 @Override
 public String deleteProductByAdmin(Long id) {

     Product p = productRepo.findById(id)
             .orElseThrow(() -> new RuntimeException("Product not found"));

     p.setDeleted(true);
     productRepo.save(p);
     return "Product deleted by admin";
 }

 // ================= HELPERS =================

 private String uploadToCloudinary(MultipartFile file) {
     try {
         Map<?, ?> res = cloudinary.uploader().upload(file.getBytes(), Map.of());
         return res.get("secure_url").toString();
     } catch (Exception e) {
         throw new RuntimeException("Image upload failed");
     }
 }

 private Seller getSellerFromAuth(Authentication auth) {
     User user = userRepo.findByEmailAndIsDeletedFalse(auth.getName()).orElseThrow();
     return sellerRepo.findByUser_Id(user.getId()).orElseThrow();
 }

 private void validateOwnership(Authentication auth, Product p) {

     if (auth.getAuthorities().stream()
             .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) return;

     Seller seller = getSellerFromAuth(auth);

     if (!p.getSeller().getId().equals(seller.getId()))
         throw new RuntimeException("Not your product");
 }

 private ProductDto toDto(Product p) {

     ProductDto dto = new ProductDto();
     dto.setId(p.getId());
     dto.setName(p.getName());
     dto.setPcategory(p.getPcategory().name());
     dto.setPrice(p.getPrice());
     dto.setUnitsAvailable(p.getUnitsAvailable());
     dto.setImageUrl(p.getImageUrl());
     dto.setDescription(p.getDescription());
     dto.setSellerId(p.getSeller() != null ? p.getSeller().getId() : null);
     return dto;
 }
}
