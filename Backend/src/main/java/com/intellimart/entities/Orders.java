package com.intellimart.entities;

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
@ToString(exclude = {"customer","address","Payment"})

public class Orders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orderId;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	private Status status;
	
	@Column(nullable  =false)
	private LocalDate orderdate;
	
	@Column(nullable  =false)
	private double totalamount;
	
//	@Column(nullable  =false)
//	private int quantity;
//	
//	@Column(nullable  =false)
//	private double perunitprice;
	
	@ManyToOne
	@JoinColumn
	private Customer customer;
		
	@ManyToOne
	@JoinColumn(name = "shipping_address_id", nullable = false)
	private Address address;
	
	
@OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY) 
private Payment payments; 

	
		
		
		
	
	

}
