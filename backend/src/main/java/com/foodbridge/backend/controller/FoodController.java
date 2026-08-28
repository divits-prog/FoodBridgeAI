package com.foodbridge.backend.controller;

import com.foodbridge.backend.entity.Food;
import com.foodbridge.backend.repository.FoodRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;


    // =========================
    // GET ALL FOODS
    // =========================

    @GetMapping
    public List<Food> getAllFoods() {

        return foodRepository.findAll();
    }


    // =========================
    // GET FOOD BY ID
    // =========================

    @GetMapping("/{id}")
    public Optional<Food> getFoodById(@PathVariable Long id) {

        return foodRepository.findById(id);
    }


    // =========================
    // ADD FOOD
    // =========================

    @PostMapping
    public Food addFood(@RequestBody Food food) {

        return foodRepository.save(food);
    }


    // =========================
    // UPDATE FOOD
    // =========================

    @PutMapping("/{id}")
    public Food updateFood(
            @PathVariable Long id,
            @RequestBody Food food) {

        Food existingFood = foodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Food not found with id: " + id)
                );

        existingFood.setFoodName(food.getFoodName());
        existingFood.setDescription(food.getDescription());
        existingFood.setPrice(food.getPrice());
        existingFood.setCategory(food.getCategory());
        existingFood.setAvailable(food.getAvailable());
        existingFood.setImageUrl(food.getImageUrl());
        existingFood.setRestaurant(food.getRestaurant());

        return foodRepository.save(existingFood);
    }


    // =========================
    // DELETE FOOD
    // =========================

    @DeleteMapping("/{id}")
    public String deleteFood(@PathVariable Long id) {

        if (!foodRepository.existsById(id)) {

            return "Food not found with id: " + id;
        }

        foodRepository.deleteById(id);

        return "Food deleted successfully";
    }
}