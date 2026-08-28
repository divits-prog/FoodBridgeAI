package com.foodbridge.backend.controller;

import com.foodbridge.backend.dto.LoginRequest;
import com.foodbridge.backend.dto.LoginResponse;
import com.foodbridge.backend.entity.User;
import com.foodbridge.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return userService.register(user);
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest) {

        return userService.login(loginRequest);
    }

    // =========================
    // TEST
    // =========================

    @GetMapping("/test")
    public String test() {

        return "User Controller Working";
    }
}