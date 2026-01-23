package com.intellimart.dto;

import java.math.BigDecimal;
import com.intellimart.entities.ProductCategory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private ProductCategory pcategory;
    private BigDecimal price;
    private int unitsAvailable;
    private Long sellerId;
    private String imageUrl; // cloud link
}
