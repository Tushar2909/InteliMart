package com.intellimart.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private ProductCategory pcategory;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "units_available", nullable = false)
    private int unitsAvailable;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "seller_id")
    private Long sellerId;
    
    private boolean isDeleted = false;  // ✅ Manual soft delete flag
}
