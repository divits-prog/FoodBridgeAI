package com.foodbridge.backend.service;

import com.foodbridge.backend.entity.Cart;
import com.foodbridge.backend.entity.Food;
import com.foodbridge.backend.repository.CartRepository;
import com.foodbridge.backend.repository.FoodRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodRepository foodRepository;

    // =========================
    // ADD TO CART
    // =========================
    public Cart addToCart(Cart cart) {
        if (cart.getFood() == null || cart.getFood().getId() == null) {
            throw new RuntimeException("Food ID is required");
        }

        Food food = foodRepository.findById(cart.getFood().getId())
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + cart.getFood().getId()));

        int qtyToAdd = cart.getQuantity() > 0 ? cart.getQuantity() : 1;
        double price = food.getPrice() != null ? food.getPrice() : 0.0;

        // Check if user already has this food in cart
        if (cart.getUser() != null && cart.getUser().getId() != null) {
            Optional<Cart> existing = cartRepository.findByUserIdAndFoodId(cart.getUser().getId(), food.getId());
            if (existing.isPresent()) {
                Cart existingCart = existing.get();
                int newQty = existingCart.getQuantity() + qtyToAdd;
                existingCart.setQuantity(newQty);
                existingCart.setTotalPrice(price * newQty);
                return cartRepository.save(existingCart);
            }
        }

        cart.setFood(food);
        cart.setQuantity(qtyToAdd);
        cart.setTotalPrice(price * qtyToAdd);
        return cartRepository.save(cart);
    }

    // =========================
    // GET ALL CART ITEMS
    // =========================
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    // =========================
    // GET CART BY USER
    // =========================
    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // =========================
    // GET CART ITEM BY ID
    // =========================
    public Cart getCartById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
    }

    // =========================
    // UPDATE CART
    // =========================
    public Cart updateCart(Long id, Cart updatedCart) {
        Cart existingCart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));

        int newQty = updatedCart.getQuantity();
        if (newQty <= 0) {
            cartRepository.delete(existingCart);
            return null;
        }

        existingCart.setQuantity(newQty);

        double price = 0.0;
        if (existingCart.getFood() != null && existingCart.getFood().getPrice() != null) {
            price = existingCart.getFood().getPrice();
        }

        existingCart.setTotalPrice(price * newQty);
        return cartRepository.save(existingCart);
    }

    // =========================
    // DELETE CART
    // =========================
    public void deleteCart(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
        cartRepository.delete(cart);
    }

    // =========================
    // CLEAR CART BY USER
    // =========================
    @Transactional
    public void clearCartByUser(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
