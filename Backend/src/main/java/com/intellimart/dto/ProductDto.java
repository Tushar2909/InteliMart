package com.intellimart.dto;

import java.math.BigDecimal;

import com.intellimart.entities.ProductCategory;

import lombok.Data;

@Data
public class ProductDto {

    private Long id;

    private String name;

    private ProductCategory pcategory;   // 🔥 ENUM not String

    private BigDecimal price;

    private Integer unitsAvailable;

    private String imageUrl;

    private String description;

    private Long sellerId;
}
