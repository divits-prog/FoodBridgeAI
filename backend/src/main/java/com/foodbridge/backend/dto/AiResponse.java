package com.foodbridge.backend.dto;

import java.util.List;

public class AiResponse {
    private String reply;
    private List<AiDishCard> dishes;
    private String aiInsights;

    public AiResponse() {
    }

    public AiResponse(String reply, List<AiDishCard> dishes, String aiInsights) {
        this.reply = reply;
        this.dishes = dishes;
        this.aiInsights = aiInsights;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<AiDishCard> getDishes() {
        return dishes;
    }

    public void setDishes(List<AiDishCard> dishes) {
        this.dishes = dishes;
    }

    public String getAiInsights() {
        return aiInsights;
    }

    public void setAiInsights(String aiInsights) {
        this.aiInsights = aiInsights;
    }
}
