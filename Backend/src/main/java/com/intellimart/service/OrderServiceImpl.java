package com.intellimart.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.entities.CartItem;
import com.intellimart.entities.Customer;
import com.intellimart.entities.OrderLineItem;
import com.intellimart.entities.Orders;
import com.intellimart.entities.Product;
import com.intellimart.entities.Status;
import com.intellimart.repos.CartRepo;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.OrderRepo;
import com.intellimart.repos.ProductRepo;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OrderServiceImpl implements OrderServiceInterface {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final CustomerRepo customerRepo;
    private final CartRepo cartRepo;

    @Override
    public Orders placeOrder(Long customerId) {

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found or deactivated"));

        List<CartItem> cartItems = cartRepo.findByCustomer_IdAndIsDeletedFalse(customerId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Add items before checkout!");
        }

        Orders order = new Orders();
        order.setCustomer(customer);
        order.setOrderDate(LocalDate.now());
        order.setStatus(Status.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);
        order.setLineItems(new HashSet<>());

        // Pick first address as shipping address
        order.setAddress(customer.getAddresses().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No shipping address found")));

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product.getUnitsAvailable() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            product.setUnitsAvailable(product.getUnitsAvailable() - cartItem.getQuantity());

            OrderLineItem lineItem = new OrderLineItem();
            lineItem.setOrder(order);
            lineItem.setProduct(product);
            lineItem.setQuantity(cartItem.getQuantity());
            lineItem.setUnitPrice(product.getPrice().doubleValue());

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            order.setTotalAmount(order.getTotalAmount().add(itemTotal));
            order.getLineItems().add(lineItem);
        }

        Orders savedOrder = orderRepo.save(order);

        // Soft delete cart items
        for (CartItem item : cartItems) {
            item.setDeleted(true);
            cartRepo.save(item);
        }

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Orders> getCustomerOrders(Long customerId) {
        return orderRepo.findByCustomer_IdAndIsDeletedFalse(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public Orders getOrderById(Long orderId) {
        return orderRepo.findById(orderId)
                .filter(order -> !order.isDeleted())
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
