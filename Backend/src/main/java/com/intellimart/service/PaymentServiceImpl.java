package com.intellimart.service;

import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.PaymentDto;
import com.intellimart.entities.*;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.OrderRepo;
import com.intellimart.repos.PaymentRepo;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentServiceInterface {

    private final PaymentRepo paymentRepo;
    private final OrderRepo orderRepo;
    private final CustomerRepo customerRepo;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Override
    public PaymentDto createRazorpayOrder(Long orderId) {

        Orders order = orderRepo.findById(orderId).orElseThrow();

        try {

            JSONObject req = new JSONObject();
            req.put("amount", order.getTotalAmount().multiply(new java.math.BigDecimal(100)));
            req.put("currency", "INR");
            req.put("receipt", "order_" + orderId);

            var razorOrder = razorpayClient.orders.create(req);

            Payment p = new Payment();
            p.setOrder(order);
            p.setAmount(order.getTotalAmount());
            p.setStatus(PaymentStatus.PENDING);
            p.setRazorpayOrderId(razorOrder.get("id"));
            p.setCreatedAt(LocalDateTime.now());

            return toDto(paymentRepo.save(p));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public PaymentDto verifyPayment(Long paymentId,
                                    String razorpayPaymentId,
                                    String razorpayOrderId,
                                    String signature) {

        Payment p = paymentRepo.findById(paymentId).orElseThrow();

        try {

            Utils.verifySignature(
                    razorpayOrderId + "|" + razorpayPaymentId,
                    signature,
                    razorpaySecret);

            p.setRazorpayPaymentId(razorpayPaymentId);
            p.setStatus(PaymentStatus.SUCCESS);
            p.setPaymentTime(LocalDateTime.now());

            return toDto(paymentRepo.save(p));

        } catch (Exception e) {
            throw new RuntimeException("Verification failed");
        }
    }

    @Override
    public List<PaymentDto> getCustomerPaymentsByEmail(String email) {

        Long cid =
                customerRepo.findByUser_Email(email)
                        .orElseThrow()
                        .getId();

        return paymentRepo.findByOrder_Customer_Id(cid)
                .stream().map(this::toDto).toList();
    }

    @Override
    public List<PaymentDto> getSellerPayments(Long sellerId) {

        return paymentRepo.findByOrder_LineItems_Product_Seller_Id(sellerId)
                .stream().map(this::toDto).toList();
    }

    @Override
    public List<PaymentDto> getAllPayments() {

        return paymentRepo.findAll().stream().map(this::toDto).toList();
    }

    private PaymentDto toDto(Payment p) {

        PaymentDto dto = new PaymentDto();

        dto.setId(p.getId());
        dto.setAmount(p.getAmount());
        dto.setStatus(p.getStatus());
        dto.setOrderId(p.getOrder().getOrderId());
        dto.setRazorpayOrderId(p.getRazorpayOrderId());
        dto.setRazorpayPaymentId(p.getRazorpayPaymentId());

        return dto;
    }
}
