	package com.intellimart.entities;
	
	import java.math.BigDecimal;
	
	import jakarta.persistence.Column;
	import jakarta.persistence.EmbeddedId;
	import jakarta.persistence.Entity;
	import jakarta.persistence.FetchType;
	import jakarta.persistence.JoinColumn;
	import jakarta.persistence.ManyToOne;
	import jakarta.persistence.MapsId;
	import jakarta.persistence.Table;
	import jakarta.validation.constraints.NotNull;
	import lombok.AllArgsConstructor;
	import lombok.Data;
	import lombok.NoArgsConstructor;
	import lombok.ToString;
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Entity
	@Table(name = "orderlineitems")
	// Exclude links to prevent recursion
	@ToString(exclude = {"order", "product"}) 
	public class OrderLineItem { 
	
	    // 1. Composite Primary Key
	    @EmbeddedId 
	    private OrderLineItemId id; 
	
	    
	    @NotNull
	    @Column(nullable = false)
	    private int quantity; // The quantity purchased in THIS order
	    
	    // Historical price: crucial for accounting
	    @NotNull
	    @Column(name = "unit_price_at_purchase", precision = 10, scale = 2)
	    private BigDecimal unitPrice; 
	    
	    // 3. Relationships (Owner of the Foreign Keys)
	    
	    // M:1 to Order (Links back to the parent Order)
	    @ManyToOne(fetch = FetchType.LAZY)
	    @MapsId("orderId") // Maps the field 'orderId' from the key class
	    @JoinColumn(name = "order_id", nullable = false)
	    private Orders order;
	
	    // M:1 to Product (Links to the specific Product sold)
	    @ManyToOne(fetch = FetchType.LAZY)
	    @MapsId("productId") // Maps the field 'productId' from the key class
	    @JoinColumn(name = "product_id", nullable = false)
	    private Product product;
	}