package com.intellimart.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.intellimart.entities.Address;

public interface AddressRepo extends JpaRepository<Address, Long> {

    // Fetch addresses directly by the primary key of the customer record
    List<Address> findByCustomer_Id(Long customerId);

    // ✅ NEW: Fetch addresses using the User ID linked to the Customer record
    List<Address> findByCustomer_User_Id(Long userId);
}