package com.foodbridge.backend.controller;

import com.foodbridge.backend.dto.AiRequest;
import com.foodbridge.backend.dto.AiResponse;
import com.foodbridge.backend.service.AiService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/recommend")
    public AiResponse getRecommendations(@RequestBody(required = false) AiRequest request) {
        if (request == null) {
            request = new AiRequest();
        }
        return aiService.getRecommendations(request);
    }

    @PostMapping("/chat")
    public AiResponse chatWithAi(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        AiRequest req = new AiRequest();
        req.setPrompt(message);
        return aiService.getRecommendations(req);
    }

    @GetMapping("/test")
    public String testAi() {
        return "FoodBridge AI Engine Online";
    }
}
