//package com.intellimart.entities;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.util.Set;
//
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.OneToMany;
//import jakarta.persistence.OneToOne;
//import jakarta.persistence.Table;
//import jakarta.validation.constraints.NotNull;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.ToString;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//
//
//@Entity
//@Table(name ="orders")
//@ToString(exclude = {"customer","address","Payment",""})
//
//public class Orders {
//	
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private Long orderId;
//	
//	@NotNull
//	@Enumerated(EnumType.STRING)
//	private Status status;
//	
//	@Column(nullable  =false)
//	private LocalDate orderDate;
//	
//    @Column(name = "unitPriceAtPurchase", precision = 10, scale = 2)
//
//	private BigDecimal totalAmount;
//	
////	@Column(nullable  =false)
////	private int quantity;
////	
////	@Column(nullable  =false)
////	private double perunitprice;
//	
//	@ManyToOne
//	@JoinColumn(name = "customerId", nullable = false)	
//	private Customer customer;
//		
//	@ManyToOne
//	@JoinColumn(name = "shippingAddressId", nullable = false)
//	private Address address;
//	
//	
//@OneToOne(mappedBy = "orders", cascade = CascadeType.ALL, fetch = FetchType.LAZY) 
//private Payment payments; 
//
//@OneToMany
//(mappedBy = "order", cascade = CascadeType.ALL) 
//private Set<OrderLineItem> lineItems;
//		
//
//}


package com.intellimart.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name ="orders")
// Correctly exclude all relationships (customer, address, singular payment, lineItems)
@ToString(exclude = {"customer", "address", "payment", "lineItems"}) 

public class Orders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orderId;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	private Status status; 
	
	@Column(nullable = false)
	private LocalDate orderDate;
	
    // FIX: Uses BigDecimal for financial accuracy, correct column name, and precision
	@Column(name = "total_bill_amount", precision = 10, scale = 2, nullable = false)
	private BigDecimal totalAmount; 
	
    // M:1 Link to Customer (Owning FK definition)
	@ManyToOne
	@JoinColumn(name = "customer_id", nullable = false) 
	private Customer customer;
		
    // M:1 Link to Address (Owning FK definition for shipping address)
	@ManyToOne
	@JoinColumn(name = "shipping_address_id", nullable = false)
	private Address address;
	
    // 1:1 Link to Payment (Non-Owner side)
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)	
    private Payment payment; // FIX: Singular field name for 1:1 relationship
    
    // CRITICAL FIX: 1:M Link to products purchased (The ONLY place for quantity/details)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderLineItem> lineItems;
}