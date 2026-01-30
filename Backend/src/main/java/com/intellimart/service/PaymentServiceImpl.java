package com.intellimart.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.PaymentDto;
import com.intellimart.entities.Orders;
import com.intellimart.entities.Payment;
import com.intellimart.entities.PaymentStatus;
import com.intellimart.entities.Status;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.OrderRepo;
import com.intellimart.repos.PaymentRepo;
import com.razorpay.Order;
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

    private final String KEY_ID = "rzp_test_S88JK7IccT0yYB";
    private final String KEY_SECRET = "YOUR_RAZORPAY_SECRET";

    @Override
    public PaymentDto createRazorpayOrder(Long orderId) {

        Orders order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        try {
            RazorpayClient razorpay = new RazorpayClient(KEY_ID, KEY_SECRET);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", order.getTotalAmount().multiply(new BigDecimal(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + order.getOrderId());

            Order rzpOrder = razorpay.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setRazorpayOrderId(rzpOrder.get("id"));
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentStatus(PaymentStatus.PENDING);

            return toDto(paymentRepo.save(payment));
        } catch (Exception e) {
            throw new RuntimeException("Razorpay Order creation failed: " + e.getMessage());
        }
    }

    @Override
    public PaymentDto verifyPayment(Long paymentId, String razorpayPaymentId, String razorpayOrderId, String signature) {

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, KEY_SECRET);

            if (!isValid) throw new RuntimeException("Invalid Payment Signature");

            Payment payment = paymentRepo.findById(paymentId).orElseThrow();

            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setRazorpayPaymentId(razorpayPaymentId);

            Orders order = payment.getOrder();
            order.setStatus(Status.CONFIRMED);
            orderRepo.save(order);

            return toDto(paymentRepo.save(payment));

        } catch (Exception e) {
            throw new RuntimeException("Payment Verification Failed");
        }
    }

    @Override
    public List<PaymentDto> getCustomerPayments(Long userId) {
        return paymentRepo.findByOrder_Customer_User_Id(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getCustomerPaymentsByEmail(String email) {
        return paymentRepo.findByOrder_Customer_User_Email(email)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getSellerPayments(Long sellerId) {
        return paymentRepo.findPaymentsBySeller(sellerId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getAllPayments() {
        return paymentRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    private PaymentDto toDto(Payment p) {

        PaymentDto dto = new PaymentDto();
        dto.setId(p.getId());
        dto.setOrderId(p.getOrder().getOrderId());
        dto.setAmount(p.getAmount());

        // ✅ NULL SAFE (fixes your crash)
        if (p.getPaymentStatus() != null)
            dto.setPaymentStatus(p.getPaymentStatus().name());
        else
            dto.setPaymentStatus("PENDING");

        dto.setRazorpayOrderId(p.getRazorpayOrderId());
        dto.setRazorpayPaymentId(p.getRazorpayPaymentId());
        return dto;
    }
}
