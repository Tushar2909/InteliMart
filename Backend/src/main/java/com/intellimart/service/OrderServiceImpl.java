package com.intellimart.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.*;
import com.intellimart.repos.CartRepo;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.OrderRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderServiceInterface {

    private final OrderRepo orderRepo;
    private final CustomerRepo customerRepo;
    private final CartRepo cartRepo;

    @Override
    public OrderDto placeOrder(Long customerId) {

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(customerId)
                .orElseThrow();

        List<CartItem> cartItems =
                cartRepo.findByCustomer_IdAndIsDeletedFalse(customerId);

        Orders order = new Orders();
        order.setCustomer(customer);
        order.setOrderDate(LocalDate.now());
        order.setStatus(Status.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);
        order.setLineItems(new HashSet<>());

        order.setAddress(customer.getAddresses().stream().findFirst().orElseThrow());

        for (CartItem c : cartItems) {

            Product p = c.getProduct();

            OrderLineItem li = new OrderLineItem();
            li.setOrder(order);
            li.setProduct(p);
            li.setQuantity(c.getQuantity());
            li.setUnitPrice(p.getPrice().doubleValue());

            order.getLineItems().add(li);

            order.setTotalAmount(
                    order.getTotalAmount().add(
                            p.getPrice().multiply(BigDecimal.valueOf(c.getQuantity()))
                    )
            );

            c.setDeleted(true);
        }

        return toDto(orderRepo.save(order));
    }

    @Override
    public List<OrderDto> getCustomerOrdersByEmail(String email) {

        Customer customer =
                customerRepo.findByUser_Email(email)
                        .orElseThrow();

        return orderRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public OrderDto getOrderById(Long orderId) {

        return toDto(orderRepo.findById(orderId).orElseThrow());
    }

    @Override
    public List<OrderDto> getAllOrders() {

        return orderRepo.findByIsDeletedFalse()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public OrderDto updateOrderStatus(Long orderId, Status status) {

        Orders o = orderRepo.findById(orderId).orElseThrow();
        o.setStatus(status);
        return toDto(orderRepo.save(o));
    }

    @Override
    public List<SellerOrderDto> getSellerOrders(Long sellerId) {

        return orderRepo.findOrdersBySeller(sellerId)
                .stream()
                .flatMap(o ->
                        o.getLineItems().stream()
                                .filter(li ->
                                        li.getProduct().getSeller().getId().equals(sellerId))
                                .map(li -> {

                                    SellerOrderDto dto = new SellerOrderDto();

                                    dto.setOrderId(o.getOrderId());
                                    dto.setProductName(li.getProduct().getName());
                                    dto.setQuantity(li.getQuantity());
                                    dto.setAmount(
                                            li.getProduct().getPrice()
                                                    .multiply(BigDecimal.valueOf(li.getQuantity()))
                                    );
                                    dto.setStatus(o.getStatus());
                                    dto.setOrderDate(o.getOrderDate());

                                    return dto;
                                }))
                .toList();
    }

    private OrderDto toDto(Orders o) {

        OrderDto dto = new OrderDto();

        dto.setOrderId(o.getOrderId());
        dto.setCustomerId(o.getCustomer().getId());
        dto.setStatus(o.getStatus());
        dto.setOrderDate(o.getOrderDate());
        dto.setTotalAmount(o.getTotalAmount());

        return dto;
    }
}
