package com.intellimart.repos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.intellimart.entities.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findAllByIsDeletedFalse();
    Optional<Product> findByIdAndIsDeletedFalse(Long id);
}
