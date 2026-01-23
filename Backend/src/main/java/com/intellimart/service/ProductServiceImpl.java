package com.intellimart.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.ProductDto;
import com.intellimart.entities.Product;
import com.intellimart.repos.ProductRepo;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ProductServiceImpl implements ProductServiceInterface {

    private final ProductRepo productRepo;
    private final ModelMapper mapper;

    @Override
    public List<ProductDto> getAllProducts() {

        List<Product> products = productRepo.findAllByIsDeletedFalse();
        List<ProductDto> dtoList = new ArrayList<>();

        for (Product product : products) {
            dtoList.add(mapper.map(product, ProductDto.class));
        }

        return dtoList;
    }

    @Override
    public ProductDto getProductById(Long id) {

        Product product = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapper.map(product, ProductDto.class);
    }

    @Override
    public ProductDto addProduct(ProductDto dto) {

        Product product = mapper.map(dto, Product.class);
        product.setDeleted(false);

        Product saved = productRepo.save(product);
        return mapper.map(saved, ProductDto.class);
    }

    @Override
    public String deleteProduct(Long id) {

        Product product = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setDeleted(true);
        productRepo.save(product);

        return "Product soft deleted successfully";
    }
    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) {

        Product product = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setUnitsAvailable(dto.getUnitsAvailable());
        product.setPcategory(dto.getPcategory());
        product.setImageUrl(dto.getImageUrl());

        return mapper.map(productRepo.save(product), ProductDto.class);
    }

}
