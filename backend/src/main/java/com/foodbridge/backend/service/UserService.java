package com.foodbridge.backend.service;

import com.foodbridge.backend.dto.LoginRequest;
import com.foodbridge.backend.dto.LoginResponse;
import com.foodbridge.backend.entity.User;
import com.foodbridge.backend.jwt.JwtService;
import com.foodbridge.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // =========================
    // REGISTER
    // =========================

    public User register(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================

    public LoginResponse login(LoginRequest loginRequest) {

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        loginRequest.getEmail()
                );

        // User doesn't exist
        if (optionalUser.isEmpty()) {

            return new LoginResponse(
                    "User not found",
                    null,
                    null,
                    null,
                    null
            );
        }

        User user = optionalUser.get();

        // Check password
        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword())) {

            return new LoginResponse(
                    "Invalid Password",
                    null,
                    null,
                    null,
                    null
            );
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(
                "Login Successful",
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}