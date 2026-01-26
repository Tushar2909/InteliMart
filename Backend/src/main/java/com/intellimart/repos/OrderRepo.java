package com.intellimart.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.intellimart.entities.Orders;

public interface OrderRepo extends JpaRepository<Orders, Long> {

    List<Orders> findByCustomer_IdAndIsDeletedFalse(Long customerId);

    List<Orders> findByIsDeletedFalse();

    @Query("""
        SELECT DISTINCT o FROM Orders o
        JOIN o.lineItems li
        JOIN li.product p
        WHERE p.seller.id = :sellerId
        AND o.isDeleted = false
    """)
    List<Orders> findOrdersBySeller(@Param("sellerId") Long sellerId);
}
