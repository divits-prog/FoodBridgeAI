package com.foodbridge.backend.controller;

import com.foodbridge.backend.entity.Cart;
import com.foodbridge.backend.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;


    @GetMapping
    public List<Cart> getAllCartItems() {
        return cartService.getAllCartItems();
    }


    @GetMapping("/user/{userId}")
    public List<Cart> getUserCart(
            @PathVariable Long userId) {

        return cartService.getCartByUser(userId);
    }


    @GetMapping("/{id}")
    public Optional<Cart> getCartById(
            @PathVariable Long id) {

        return Optional.of(cartService.getCartById(id));
    }


    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {

        return cartService.addToCart(cart);
    }


    @PutMapping("/{id}")
    public Cart updateCart(
            @PathVariable Long id,
            @RequestBody Cart cart) {

        return cartService.updateCart(id, cart);
    }


    @DeleteMapping("/{id}")
    public String deleteCart(@PathVariable Long id) {

        cartService.deleteCart(id);

        return "Cart item deleted successfully";
    }
}