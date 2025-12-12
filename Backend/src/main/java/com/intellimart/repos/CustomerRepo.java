package com.intellimart.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.intellimart.entities.Customer;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
	

}
