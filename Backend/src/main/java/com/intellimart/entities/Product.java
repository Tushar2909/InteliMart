package com.intellimart.entities;

import java.math.BigDecimal;
import java.sql.Blob;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude ="seller")


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

	private String name ;
	
	@Column(nullable = false)

	private int unitsAvailable;
	
//	@Column(nullable = "true")
	private Blob images;
	
	@ManyToOne
	@JoinColumn
	private Seller seller;

	
}
