package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.intellimart.entities.Orders;
import com.intellimart.service.OrderServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceInterface orderService;

    @PostMapping("/place/{customerId}")
    public ResponseEntity<Orders> placeOrder(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.placeOrder(customerId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Orders>> getOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getCustomerOrders(customerId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Orders> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
