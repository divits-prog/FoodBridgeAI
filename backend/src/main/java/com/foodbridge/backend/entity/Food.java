package com.foodbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "foods")
@Data
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String foodName;

    private String description;

    @Column(nullable = false)
    private Double price;

    private String category;

    private Boolean available = true;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}