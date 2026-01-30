package com.intellimart.service;

import com.intellimart.dto.CartItemDto;
import com.intellimart.entities.CartItem;
import java.util.List;

public interface CartServiceInterface {
    String addItemToCart(Long userId, Long productId, int quantity);
    List<CartItemDto> getCartDtos(Long userId);
    List<CartItem> getCartByCustomer(Long userId);
    String clearCart(Long userId);
    String updateQuantity(Long cartItemId, int quantity);
    String removeItemFromCart(Long cartItemId);
}
