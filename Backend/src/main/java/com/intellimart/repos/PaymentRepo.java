package com.intellimart.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.intellimart.entities.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

    // CUSTOMER
    List<Payment> findByOrder_Customer_Id(Long customerId);

    // SELLER (order → lineItems → product → seller)
    List<Payment> findByOrder_LineItems_Product_Seller_Id(Long sellerId);
}
