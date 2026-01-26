package com.intellimart.service;

import java.util.List;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.Status;

public interface OrderServiceInterface {

    OrderDto placeOrder(Long customerId);

    List<OrderDto> getCustomerOrdersByEmail(String email);

    OrderDto getOrderById(Long orderId);

    List<OrderDto> getAllOrders();

    OrderDto updateOrderStatus(Long orderId, Status status);

    List<SellerOrderDto> getSellerOrders(Long sellerId);
}
