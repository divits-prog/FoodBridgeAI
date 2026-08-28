package com.foodbridge.backend.repository;

import com.foodbridge.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository
        extends JpaRepository<Restaurant, Long> {
}