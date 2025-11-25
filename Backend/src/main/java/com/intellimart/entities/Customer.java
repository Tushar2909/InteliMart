package com.intellimart.entities;

import java.util.Set;
import jakarta.persistence.*; // Use * for simplicity here
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
// FIX: Added 'addresses' to exclude list
@ToString(exclude = {"user", "addresses"}) 
@Entity
@Table(name = "customers")
public class Customer {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne

	@JoinColumn(name = "customer_user_id", unique = true, nullable = false) 
	private User user;
	
	
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY) 
	private Set<Address> addresses; 

}