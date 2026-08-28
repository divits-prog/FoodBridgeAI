package com.foodbridge.backend.service;

import com.foodbridge.backend.entity.Order;
import com.foodbridge.backend.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;


    // =========================
    // CREATE ORDER
    // =========================

    public Order createOrder(Order order) {

        if (order.getOrderStatus() == null ||
                order.getOrderStatus().isEmpty()) {

            order.setOrderStatus("PLACED");
        }

        return orderRepository.save(order);
    }


    // =========================
    // GET ALL ORDERS
    // =========================

    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // =========================
    // GET ORDER BY ID
    // =========================

    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with ID: " + id
                        )
                );
    }


    // =========================
    // GET ORDERS BY USER
    // =========================

    public List<Order> getOrdersByUser(Long userId) {

        return orderRepository.findByUserId(userId);
    }


    // =========================
    // UPDATE ORDER
    // =========================

    public Order updateOrder(Long id, Order updatedOrder) {

        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with ID: " + id
                        )
                );

        existingOrder.setTotalAmount(
                updatedOrder.getTotalAmount()
        );

        existingOrder.setOrderStatus(
                updatedOrder.getOrderStatus()
        );

        existingOrder.setUser(
                updatedOrder.getUser()
        );

        return orderRepository.save(existingOrder);
    }


    // =========================
    // DELETE ORDER
    // =========================

    public void deleteOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with ID: " + id
                        )
                );

        orderRepository.delete(order);
    }
}