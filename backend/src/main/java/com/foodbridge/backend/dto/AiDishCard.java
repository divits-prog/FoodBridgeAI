package com.foodbridge.backend.dto;

public class AiDishCard {
    private Long id;
    private String foodName;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private String restaurantName;
    private Double rating;
    private String matchReason;

    public AiDishCard() {
    }

    public AiDishCard(Long id, String foodName, String description, Double price,
                      String category, String imageUrl, String restaurantName,
                      Double rating, String matchReason) {
        this.id = id;
        this.foodName = foodName;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.restaurantName = restaurantName;
        this.rating = rating;
        this.matchReason = matchReason;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }
}
