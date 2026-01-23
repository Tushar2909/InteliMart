package com.intellimart.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // ================= ADD ITEM TO CART =================

    @Override
    public String addItemToCart(Long customerId, Long productId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        Customer customer = customerRepo.findByIdAndIsDeletedFalse(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found or deactivated"));

        Product product = productRepo.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new RuntimeException("Product not found or unavailable"));

        CartItem existingItem = cartRepo.findByCustomerAndProduct(customer, product).orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartRepo.save(existingItem);
            return "Quantity updated in cart";
        }

        CartItem newItem = new CartItem();
        newItem.setCustomer(customer);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        newItem.setDeleted(false);

        cartRepo.save(newItem);

        return "Item added to cart successfully";
    }

    // ================= GET CART ITEMS =================

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> getCartByCustomer(Long customerId) {

        return cartRepo.findByCustomer_IdAndIsDeletedFalse(customerId);
    }

    // ================= REMOVE ITEM (SOFT DELETE) =================

    @Override
    public String removeItemFromCart(Long cartItemId) {

        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setDeleted(true);
        cartRepo.save(item);

        return "Item removed from cart";
    }

    // ================= UPDATE QUANTITY =================

    @Override
    public String updateQuantity(Long cartItemId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);
        cartRepo.save(item);

        return "Quantity updated successfully";
    }
}
