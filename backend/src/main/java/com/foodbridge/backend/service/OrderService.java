package com.foodbridge.backend.service;

import com.foodbridge.backend.entity.Order;
import com.foodbridge.backend.repository.CartRepository;
import com.foodbridge.backend.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    // =========================
    // CREATE ORDER
    // =========================
    @Transactional
    public Order createOrder(Order order) {
        if (order.getOrderStatus() == null || order.getOrderStatus().isEmpty()) {
            order.setOrderStatus("PLACED");
        } else {
            order.setOrderStatus(order.getOrderStatus().trim().toUpperCase());
        }

        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);

        // Clear cart for this user upon order placement
        if (order.getUser() != null && order.getUser().getId() != null) {
            try {
                cartRepository.deleteByUserId(order.getUser().getId());
            } catch (Exception e) {
                // Cart clearing non-fatal
            }
        }

        return saved;
    }

    // =========================
    // GET ALL ORDERS
    // =========================
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    // =========================
    // GET ORDER BY ID
    // =========================
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + id)
                );
    }

    // =========================
    // GET ORDERS BY USER
    // =========================
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByIdDesc(userId);
    }

    // =========================
    // UPDATE ORDER
    // =========================
    public Order updateOrder(Long id, Order updatedOrder) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + id)
                );

        if (updatedOrder.getTotalAmount() > 0) {
            existingOrder.setTotalAmount(updatedOrder.getTotalAmount());
        }
        if (updatedOrder.getOrderStatus() != null) {
            existingOrder.setOrderStatus(updatedOrder.getOrderStatus().trim().toUpperCase());
        }
        if (updatedOrder.getDeliveryAddress() != null) {
            existingOrder.setDeliveryAddress(updatedOrder.getDeliveryAddress());
        }
        if (updatedOrder.getItemsSummary() != null) {
            existingOrder.setItemsSummary(updatedOrder.getItemsSummary());
        }
        if (updatedOrder.getPaymentMethod() != null) {
            existingOrder.setPaymentMethod(updatedOrder.getPaymentMethod());
        }

        return orderRepository.save(existingOrder);
    }

    // =========================
    // UPDATE STATUS QUICK
    // =========================
    public Order updateOrderStatus(Long id, String status) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + id)
                );
        if (status != null && !status.isBlank()) {
            existingOrder.setOrderStatus(status.trim().toUpperCase());
        }
        return orderRepository.save(existingOrder);
    }

    // =========================
    // DELETE ORDER
    // =========================
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + id)
                );
        orderRepository.delete(order);
    }
}
