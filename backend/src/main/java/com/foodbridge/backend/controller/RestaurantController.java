package com.foodbridge.backend.controller;

import com.foodbridge.backend.entity.Restaurant;
import com.foodbridge.backend.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public Restaurant addRestaurant(
            @RequestBody Restaurant restaurant) {

        return restaurantService.addRestaurant(restaurant);
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {

        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(
            @PathVariable Long id) {

        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant restaurant) {

        return restaurantService.updateRestaurant(id, restaurant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRestaurant(
            @PathVariable Long id) {

        restaurantService.deleteRestaurant(id);

        return ResponseEntity.ok(
                "Restaurant deleted successfully"
        );
    }
}