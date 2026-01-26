package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.User;
import com.intellimart.repos.SellerRepo;
import com.intellimart.repos.UserRepo;
import com.intellimart.service.OrderServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final OrderServiceInterface orderService;
    private final UserRepo userRepo;
    private final SellerRepo sellerRepo;

    // ================= SELLER → OWN ORDERS =================

    @PreAuthorize("hasRole('SELLER')")
    @GetMapping("/orders")
    public ResponseEntity<List<SellerOrderDto>> sellerOrders(Authentication auth) {

        String email = auth.getName();

        User user = userRepo.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long sellerId = sellerRepo.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Seller not found"))
                .getId();

        return ResponseEntity.ok(orderService.getSellerOrders(sellerId));
    }
}
