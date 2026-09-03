package com.foodbridge.backend.config;

import com.foodbridge.backend.jwt.JwtFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC
                // =========================

                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login"
                ).permitAll()


                // =========================
                // RESTAURANT + FOOD VIEWING
                // =========================

                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/restaurants/**",
                    "/api/foods/**"
                ).hasAnyRole("USER", "ADMIN")


                // =========================
                // ADMIN ONLY
                // =========================

                .requestMatchers(
                    "/api/users/**",
                    "/api/restaurants/**",
                    "/api/foods/**"
                ).hasRole("ADMIN")


                // =========================
                // USER + ADMIN
                // =========================

                .requestMatchers(
                    "/api/cart/**",
                    "/api/orders/**",
                    "/api/payments/**"
                ).hasAnyRole("USER", "ADMIN")


                // =========================
                // EVERYTHING ELSE
                // =========================

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}