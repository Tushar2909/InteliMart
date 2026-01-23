package com.intellimart.service;

import java.util.List;

//import com.intellimart.dto.CustomerDto;
import com.intellimart.entities.CartItem;

public interface CartServiceInterface {
    String addItemToCart(Long customerId, Long productId, int quantity);
    List<CartItem> getCartByCustomer(Long customerId);
    String removeItemFromCart(Long cartItemId);
    String updateQuantity(Long cartItemId, int quantity);
}