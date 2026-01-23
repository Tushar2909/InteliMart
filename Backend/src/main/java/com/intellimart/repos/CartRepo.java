package com.intellimart.repos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.intellimart.entities.CartItem;
import com.intellimart.entities.Customer;
import com.intellimart.entities.Product;

public interface CartRepo extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomer_IdAndIsDeletedFalse(Long customerId);
    Optional<CartItem> findByCustomerAndProduct(Customer customer, Product product);
}
