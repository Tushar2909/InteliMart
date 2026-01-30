package com.intellimart.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {

    private Long id;

    private String name;

    private BigDecimal price;

    // frontend sends STRING
    private String pcategory;

    private String description;

    private String imageUrl;

    private Integer unitsAvailable;

    // ✅ ADD THIS (used in mapper, admin, seller)
    private Long sellerId;
}
