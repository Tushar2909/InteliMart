package com.intellimart.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true)
    @JsonIgnore
    @ToString.Exclude
    private Orders order;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String paymentMode;

    private LocalDateTime paymentTime;

    private LocalDate paymentDate;

    private String paymentMethod;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean isDeleted = false;
}
