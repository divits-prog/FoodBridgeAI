package com.foodbridge.backend.repository;

import com.foodbridge.backend.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}