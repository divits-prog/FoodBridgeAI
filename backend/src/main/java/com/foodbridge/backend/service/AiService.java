package com.foodbridge.backend.service;

import com.foodbridge.backend.dto.AiDishCard;
import com.foodbridge.backend.dto.AiRequest;
import com.foodbridge.backend.dto.AiResponse;
import com.foodbridge.backend.entity.Food;
import com.foodbridge.backend.repository.FoodRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Autowired
    private FoodRepository foodRepository;

    public AiResponse getRecommendations(AiRequest request) {
        List<Food> allFoods = foodRepository.findAll();
        if (allFoods.isEmpty()) {
            return new AiResponse(
                    "Our kitchens are currently preparing new menus! Check back shortly.",
                    Collections.emptyList(),
                    "Tip: Add your favorite local kitchens in the admin dashboard."
            );
        }

        String rawPrompt = request.getPrompt() != null ? request.getPrompt().toLowerCase().trim() : "";
        String category = request.getCategory() != null ? request.getCategory().trim() : "";
        Double maxPrice = request.getMaxPrice();

        // Filter by max price if requested
        List<Food> candidateFoods = allFoods.stream()
                .filter(f -> f.getAvailable() == null || f.getAvailable())
                .filter(f -> maxPrice == null || (f.getPrice() != null && f.getPrice() <= maxPrice))
                .filter(f -> category.isEmpty() || category.equalsIgnoreCase("All") || (f.getCategory() != null && f.getCategory().equalsIgnoreCase(category)))
                .collect(Collectors.toList());

        if (candidateFoods.isEmpty()) {
            candidateFoods = allFoods;
        }

        // Rank foods based on keyword relevance
        List<ScoredFood> scoredList = new ArrayList<>();
        boolean wantsVeg = rawPrompt.contains("veg") || rawPrompt.contains("paneer") || rawPrompt.contains("plant");
        boolean wantsSpicy = rawPrompt.contains("spicy") || rawPrompt.contains("masala") || rawPrompt.contains("hot") || rawPrompt.contains("flavor");
        boolean wantsHealthy = rawPrompt.contains("health") || rawPrompt.contains("diet") || rawPrompt.contains("light") || rawPrompt.contains("salad") || rawPrompt.contains("protein");
        boolean wantsComfort = rawPrompt.contains("comfort") || rawPrompt.contains("rice") || rawPrompt.contains("biryani") || rawPrompt.contains("curry");
        boolean wantsBudget = rawPrompt.contains("cheap") || rawPrompt.contains("budget") || rawPrompt.contains("afford");

        for (Food food : candidateFoods) {
            double score = 1.0;
            String name = (food.getFoodName() != null ? food.getFoodName().toLowerCase() : "");
            String desc = (food.getDescription() != null ? food.getDescription().toLowerCase() : "");
            String cat = (food.getCategory() != null ? food.getCategory().toLowerCase() : "");

            if (wantsVeg && (name.contains("paneer") || desc.contains("paneer") || desc.contains("veg") || cat.contains("veg"))) {
                score += 4.0;
            }
            if (wantsSpicy && (name.contains("biryani") || desc.contains("spice") || desc.contains("masala") || desc.contains("curry"))) {
                score += 3.5;
            }
            if (wantsHealthy && (desc.contains("fresh") || desc.contains("protein") || cat.contains("salad") || cat.contains("healthy"))) {
                score += 3.5;
            }
            if (wantsComfort && (name.contains("biryani") || desc.contains("creamy") || name.contains("curry") || cat.contains("main"))) {
                score += 3.0;
            }
            if (wantsBudget && food.getPrice() != null && food.getPrice() < 180) {
                score += 2.5;
            }

            // Word overlap check with raw prompt
            String[] words = rawPrompt.split("\\s+");
            for (String word : words) {
                if (word.length() > 2) {
                    if (name.contains(word)) score += 3.0;
                    if (desc.contains(word)) score += 1.5;
                    if (cat.contains(word)) score += 2.0;
                }
            }

            // Small restaurant rating boost
            if (food.getRestaurant() != null && food.getRestaurant().getRating() != null) {
                score += food.getRestaurant().getRating() * 0.2;
            }

            scoredList.add(new ScoredFood(food, score));
        }

        // Sort descending by score
        scoredList.sort((a, b) -> Double.compare(b.score, a.score));

        // Take top 3 or top 4
        int pickCount = Math.min(scoredList.size(), 4);
        List<AiDishCard> recommendedCards = new ArrayList<>();

        for (int i = 0; i < pickCount; i++) {
            Food f = scoredList.get(i).food;
            String restName = f.getRestaurant() != null ? f.getRestaurant().getRestaurantName() : "Local Kitchen";
            Double rating = f.getRestaurant() != null && f.getRestaurant().getRating() != null ? f.getRestaurant().getRating() : 4.6;

            String reason = generateReason(f, rawPrompt);

            recommendedCards.add(new AiDishCard(
                    f.getId(),
                    f.getFoodName(),
                    f.getDescription(),
                    f.getPrice(),
                    f.getCategory(),
                    f.getImageUrl(),
                    restName,
                    rating,
                    reason
            ));
        }

        String replyGreeting = generateAiSummary(rawPrompt, recommendedCards.size());
        String insight = "FoodBridge AI tip: All dishes are freshly crafted by neighborhood cooks upon ordering to minimize food waste.";

        return new AiResponse(replyGreeting, recommendedCards, insight);
    }

    private String generateReason(Food f, String prompt) {
        String name = f.getFoodName() != null ? f.getFoodName() : "Specialty";
        if (name.toLowerCase().contains("biryani")) {
            return "Slow-steamed with fragrant whole spices, tender cut, and aromatic basmati rice. Highest-rated comfort dish!";
        }
        if (name.toLowerCase().contains("paneer")) {
            return "Rich in protein and slow-cooked in artisanal cream sauce. A neighborhood vegetarian favorite.";
        }
        if (name.toLowerCase().contains("pizza")) {
            return "Fire-baked with crisp crust and premium mozzarella. Perfect for sharing or a cozy night in.";
        }
        return "Carefully matched to your craving using fresh local ingredients and verified customer ratings.";
    }

    private String generateAiSummary(String prompt, int count) {
        if (prompt.isEmpty()) {
            return "Here are " + count + " standout dishes crafted by our community's top-rated kitchens today.";
        }
        return "I found " + count + " dish" + (count > 1 ? "es" : "") + " from nearby kitchens that match your craving: \"" + prompt + "\"!";
    }

    private static class ScoredFood {
        Food food;
        double score;
        ScoredFood(Food food, double score) {
            this.food = food;
            this.score = score;
        }
    }
}
