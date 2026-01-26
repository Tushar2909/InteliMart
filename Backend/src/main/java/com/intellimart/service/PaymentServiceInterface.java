package com.intellimart.service;

import java.util.List;

import com.intellimart.dto.PaymentDto;

public interface PaymentServiceInterface {

    PaymentDto createRazorpayOrder(Long orderId);

    PaymentDto verifyPayment(
            Long paymentId,
            String razorpayPaymentId,
            String razorpayOrderId,
            String signature);

    // CUSTOMER (JWT)
    List<PaymentDto> getCustomerPaymentsByEmail(String email);

    // SELLER
    List<PaymentDto> getSellerPayments(Long sellerId);

    // ADMIN
    List<PaymentDto> getAllPayments();
}
