package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.PaymentDto;
import com.intellimart.dto.SellerDto;
import com.intellimart.entities.Status;
import com.intellimart.service.OrderServiceInterface;
import com.intellimart.service.PaymentServiceInterface;
import com.intellimart.service.SellerServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")   // 🔴 IMPORTANT
public class AdminController {

    private final SellerServiceInterface sellerService;
    private final OrderServiceInterface orderService;
    private final PaymentServiceInterface paymentService;

    // ================= SELLERS =================
    @GetMapping("/sellers")
    public ResponseEntity<List<SellerDto>> sellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    // ================= ORDERS =================
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> orders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ================= PAYMENTS =================
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDto>> payments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // ================= UPDATE ORDER STATUS =================
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long orderId,
            @RequestParam Status status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
