package com.intellimart.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "payments")
// FIX: Exclude the singular 'order' link (renamed for clarity)
@ToString(exclude ="order") 
public class Payment {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // FIX: Renamed from pid to standard 'id'
	
    // FIX: Standardized name
	@Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
	private PaymentStatus status; 
	
    // FIX: Added unique constraint for external ID
    @Column(name = "gateway_payment_id", unique = true, nullable = false)
	private String gatewayPaymentId; // Renamed from gateway_payment_id
	
    // FIX: Added precision/scale for BigDecimal
    @Column(precision = 10, scale = 2, nullable = false)
	private BigDecimal amount;
	
    // CRITICAL FIX: Deleted redundant 'transactionid' field
    
    // FIX: Standardized name
    @Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
	
	// 1:1 Link to Orders (OWNER side)
	@OneToOne
    // FIX: Enforced 1:1 constraint and clear FK name
	@JoinColumn(name = "order_id", unique = true, nullable = false)
	private Orders order; // FIX: Renamed from orders to singular 'order'
	
}