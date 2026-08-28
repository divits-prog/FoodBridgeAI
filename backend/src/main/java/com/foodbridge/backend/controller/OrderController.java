package com.foodbridge.backend.controller;

import com.foodbridge.backend.entity.Order;
import com.foodbridge.backend.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;


    // =========================
    // GET ALL ORDERS
    // =========================

    @GetMapping
    public List<Order> getAllOrders() {

        return orderService.getAllOrders();
    }


    // =========================
    // GET ORDER BY ID
    // =========================

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {

        return orderService.getOrderById(id);
    }


    // =========================
    // GET ORDERS BY USER
    // =========================

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(
            @PathVariable Long userId) {

        return orderService.getOrdersByUser(userId);
    }


    // =========================
    // CREATE ORDER
    // =========================

    @PostMapping
    public Order createOrder(@RequestBody Order order) {

        return orderService.createOrder(order);
    }


    // =========================
    // UPDATE ORDER
    // =========================

    @PutMapping("/{id}")
    public Order updateOrder(
            @PathVariable Long id,
            @RequestBody Order order) {

        return orderService.updateOrder(id, order);
    }


    // =========================
    // DELETE ORDER
    // =========================

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {

        orderService.deleteOrder(id);

        return "Order deleted successfully";
    }
}