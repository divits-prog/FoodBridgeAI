package com.foodbridge.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double totalAmount;

    private String orderStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // =========================
    // GETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public User getUser() {
        return user;
    }


    // =========================
    // SETTERS
    // =========================

    public void setId(Long id) {
        this.id = id;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public void setUser(User user) {
        this.user = user;
    }
}