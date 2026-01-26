package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.PaymentDto;
import com.intellimart.repos.SellerRepo;
import com.intellimart.service.PaymentServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServiceInterface paymentService;
    private final SellerRepo sellerRepo;

    // ================= RAZORPAY =================

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/razorpay/{orderId}")
    public ResponseEntity<PaymentDto> create(@PathVariable Long orderId) {

        return ResponseEntity.ok(paymentService.createRazorpayOrder(orderId));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentDto> verify(
            @RequestParam Long paymentId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpayOrderId,
            @RequestParam String signature) {

        return ResponseEntity.ok(
                paymentService.verifyPayment(
                        paymentId,
                        razorpayPaymentId,
                        razorpayOrderId,
                        signature
                )
        );
    }

    // ================= CUSTOMER =================

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer")
    public ResponseEntity<List<PaymentDto>> customer(Authentication auth) {

        return ResponseEntity.ok(
                paymentService.getCustomerPaymentsByEmail(auth.getName())
        );
    }

    // ================= SELLER =================

    @PreAuthorize("hasRole('SELLER')")
    @GetMapping("/seller")
    public ResponseEntity<List<PaymentDto>> seller(Authentication auth) {

        Long sellerId =
                sellerRepo.findByUser_Email(auth.getName())
                        .orElseThrow()
                        .getId();

        return ResponseEntity.ok(paymentService.getSellerPayments(sellerId));
    }

    // ================= ADMIN =================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<List<PaymentDto>> all() {

        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
