package com.foodbridge.backend.service;

import com.foodbridge.backend.entity.Restaurant;
import com.foodbridge.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Restaurant addRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurant) {

        Restaurant existing =
                restaurantRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Restaurant not found"));

        existing.setRestaurantName(restaurant.getRestaurantName());
        existing.setOwnerName(restaurant.getOwnerName());
        existing.setEmail(restaurant.getEmail());
        existing.setPhone(restaurant.getPhone());
        existing.setAddress(restaurant.getAddress());
        existing.setCity(restaurant.getCity());
        existing.setRating(restaurant.getRating());
        existing.setImageUrl(restaurant.getImageUrl());

        return restaurantRepository.save(existing);
    }

    public void deleteRestaurant(Long id) {

        if (!restaurantRepository.existsById(id)) {
            throw new RuntimeException("Restaurant not found");
        }

        restaurantRepository.deleteById(id);
    }
}