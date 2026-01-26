package com.intellimart.dto;

import java.math.BigDecimal;

import com.intellimart.entities.ProductCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private Long id;

    private String name;

    private String description;          // ✅ REQUIRED by ProductServiceImpl

    private ProductCategory pcategory;

    private BigDecimal price;

    private Integer unitsAvailable;      // ✅ Integer (not primitive)

    private Long sellerId;

    private String imageUrl;             // cloud link
}
