package com.intellimart.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.intellimart.entities.Address;

public interface AddressRepo extends JpaRepository<Address, Long> {

    List<Address> findByCustomer_Id(Long customerId);
}
