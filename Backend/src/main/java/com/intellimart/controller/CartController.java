package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.intellimart.entities.CartItem;
import com.intellimart.service.CartServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceInterface cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestParam Long customerId,
                                           @RequestParam Long productId,
                                           @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.addItemToCart(customerId, productId, quantity));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long customerId) {
        return ResponseEntity.ok(cartService.getCartByCustomer(customerId));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<String> updateQuantity(@PathVariable Long cartItemId,
                                                 @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(cartItemId, quantity));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeItem(@PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(cartItemId));
    }
}
