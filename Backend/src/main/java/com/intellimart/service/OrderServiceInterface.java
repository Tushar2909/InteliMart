package com.intellimart.service;

import java.util.List;
import com.intellimart.entities.Orders;

public interface OrderServiceInterface {
    // 1. Process checkout for a specific customer
    Orders placeOrder(Long customerId);
    
    // 2. View order history
    List<Orders> getCustomerOrders(Long customerId);
    
    // 3. View specific order details
    Orders getOrderById(Long orderId);
}