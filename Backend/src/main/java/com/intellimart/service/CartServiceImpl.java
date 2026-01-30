package com.intellimart.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.intellimart.dto.CartItemDto;
import com.intellimart.entities.CartItem;
import com.intellimart.entities.Customer;
import com.intellimart.entities.Product;
import com.intellimart.repos.CartRepo;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.ProductRepo;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CartServiceImpl implements CartServiceInterface {

    private final CartRepo cartRepo;
    private final ProductRepo productRepo;
    private final CustomerRepo customerRepo;

    @Override
    public String addItemToCart(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        Customer customer = customerRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found for User ID: " + userId));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found or unavailable"));

        Optional<CartItem> existingItem = cartRepo.findByCustomerAndProductAndIsDeletedFalse(customer, product);
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepo.save(item);
            return "Quantity updated in cart to " + item.getQuantity();
        }

        CartItem newItem = new CartItem();
        newItem.setCustomer(customer);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        newItem.setDeleted(false);
        cartRepo.save(newItem);
        return "Item added to cart successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemDto> getCartDtos(Long userId) {
        Customer customer = customerRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        List<CartItem> items = cartRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId());
        return items.stream().map(item -> {
            Product product = item.getProduct();
            return new CartItemDto(
                item.getCartItemId(),
                product.getId(),
                product.getName(),
                product.getPrice() != null ? product.getPrice().doubleValue() : 0.0,
                product.getImageUrl(),
                item.getQuantity()
            );
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> getCartByCustomer(Long userId) {
        Customer customer = customerRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        return cartRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId());
    }

    @Override
    public String clearCart(Long userId) {
        Customer customer = customerRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        
        List<CartItem> items = cartRepo.findByCustomer_IdAndIsDeletedFalse(customer.getId());
        items.forEach(item -> {
            item.setDeleted(true);
            cartRepo.save(item);
        });
        return "Cart cleared successfully. " + items.size() + " items removed.";
    }

    @Override
    public String removeItemFromCart(Long cartItemId) {
        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setDeleted(true);
        cartRepo.save(item);
        return "Item removed from cart successfully";
    }

    @Override
    public String updateQuantity(Long cartItemId, int quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }
        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        cartRepo.save(item);
        return "Quantity updated successfully to " + quantity;
    }
}
