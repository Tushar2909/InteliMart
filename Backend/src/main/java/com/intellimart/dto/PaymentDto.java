package com.intellimart.dto;

import java.math.BigDecimal;

import com.intellimart.entities.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentDto {

    private Long id;
    private BigDecimal amount;
    private PaymentStatus status;
    private String paymentMode;
    private Long orderId;

    private String razorpayOrderId;
    private String razorpayPaymentId;
}
