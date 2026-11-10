package com.foodbridge.backend.dto;

public class AiRequest {
    private String prompt;
    private String category;
    private Double maxPrice;
    private String mood;

    public AiRequest() {
    }

    public AiRequest(String prompt, String category, Double maxPrice, String mood) {
        this.prompt = prompt;
        this.category = category;
        this.maxPrice = maxPrice;
        this.mood = mood;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }
}
