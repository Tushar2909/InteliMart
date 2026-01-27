package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.PaymentDto;
import com.intellimart.dto.ProductDto;
import com.intellimart.dto.SellerDto;
import com.intellimart.entities.Status;
import com.intellimart.service.OrderServiceInterface;
import com.intellimart.service.PaymentServiceInterface;
import com.intellimart.service.ProductServiceInterface;
import com.intellimart.service.SellerServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final SellerServiceInterface sellerService;
    private final OrderServiceInterface orderService;
    private final PaymentServiceInterface paymentService;
    private final ProductServiceInterface productService;

    // ================= SELLERS =================

    @GetMapping("/sellers")
    public ResponseEntity<List<SellerDto>> sellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    // ================= PRODUCTS =================

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> products() {
        return ResponseEntity.ok(productService.getAllProducts(0, 200));
    }

    // ================= ORDERS =================

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> orders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long orderId,
            @RequestParam Status status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // ================= PAYMENTS =================

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDto>> payments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
