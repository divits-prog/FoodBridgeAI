package com.foodbridge.backend.controller;

import com.foodbridge.backend.entity.Cart;
import com.foodbridge.backend.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;


    // =========================
    // GET ALL CART ITEMS
    // =========================

    @GetMapping
    public List<Cart> getAllCartItems() {

        return cartService.getAllCartItems();
    }


    // =========================
    // GET CART BY USER ID
    // =========================

    @GetMapping("/user/{userId}")
    public List<Cart> getUserCart(@PathVariable Long userId) {

        return cartService.getCartByUser(userId);
    }


    // =========================
    // GET CART ITEM BY ID
    // =========================

    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable Long id) {

        return cartService.getCartById(id);
    }


    // =========================
    // ADD TO CART
    // =========================

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {

        return cartService.addToCart(cart);
    }


    // =========================
    // UPDATE CART
    // =========================

    @PutMapping("/{id}")
    public Cart updateCart(
            @PathVariable Long id,
            @RequestBody Cart cart) {

        return cartService.updateCart(id, cart);
    }


    // =========================
    // DELETE CART ITEM
    // =========================

    @DeleteMapping("/{id}")
    public String deleteCart(@PathVariable Long id) {

        cartService.deleteCart(id);

        return "Cart item deleted successfully";
    }
}