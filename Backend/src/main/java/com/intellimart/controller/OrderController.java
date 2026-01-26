package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.Status;
import com.intellimart.service.OrderServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceInterface orderService;

    @PostMapping("/place/{customerId}")
    public ResponseEntity<OrderDto> place(@PathVariable Long customerId) {

        return ResponseEntity.ok(orderService.placeOrder(customerId));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<OrderDto>> customer(Authentication auth) {

        return ResponseEntity.ok(orderService.getCustomerOrdersByEmail(auth.getName()));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<SellerOrderDto>> seller(@PathVariable Long sellerId) {

        return ResponseEntity.ok(orderService.getSellerOrders(sellerId));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> all() {

        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{orderId}/status/{status}")
    public ResponseEntity<OrderDto> update(@PathVariable Long orderId,
                                          @PathVariable Status status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
