package com.foodbridge.backend.service;

import com.foodbridge.backend.entity.Cart;
import com.foodbridge.backend.entity.Food;
import com.foodbridge.backend.repository.CartRepository;
import com.foodbridge.backend.repository.FoodRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

        // Find the actual food from database
        Food food = foodRepository.findById(cart.getFood().getId())
                .orElseThrow(() -> new RuntimeException("Food not found"));

        // Set the actual Food object
        cart.setFood(food);

        // Get food price
        double price = food.getPrice();

        // Calculate total price
        double totalPrice = price * cart.getQuantity();

        // Set calculated total price
        cart.setTotalPrice(totalPrice);

        // Save cart
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
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
    }


    // =========================
    // UPDATE CART
    // =========================

    public Cart updateCart(Long id, Cart updatedCart) {

        // Find existing cart item
        Cart existingCart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Find actual food
        Food food = foodRepository.findById(updatedCart.getFood().getId())
                .orElseThrow(() -> new RuntimeException("Food not found"));

        // Update quantity
        existingCart.setQuantity(updatedCart.getQuantity());

        // Update user
        existingCart.setUser(updatedCart.getUser());

        // Set actual food
        existingCart.setFood(food);

        // Get current food price
        double price = food.getPrice();

        // Calculate total
        double totalPrice = price * updatedCart.getQuantity();

        // Set total price
        existingCart.setTotalPrice(totalPrice);

        // Save updated cart
        return cartRepository.save(existingCart);
    }


    // =========================
    // DELETE CART
    // =========================

    public void deleteCart(Long id) {

        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartRepository.delete(cart);
    }
}