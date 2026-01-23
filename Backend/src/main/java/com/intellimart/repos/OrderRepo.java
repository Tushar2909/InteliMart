package com.intellimart.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.intellimart.entities.Orders;

public interface OrderRepo extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomer_IdAndIsDeletedFalse(Long customerId);
}
