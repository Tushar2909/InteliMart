package com.intellimart.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.intellimart.entities.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {

    // already using this in ProductService
    List<Product> findAllByIsDeletedFalse();

    // 👉 ADD THIS
    Optional<Product> findByIdAndIsDeletedFalse(Long id);
}
