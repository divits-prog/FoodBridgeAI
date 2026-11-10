package com.foodbridge.backend.config;

import com.foodbridge.backend.jwt.JwtFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PREFLIGHT OPTIONS
                // =========================
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // =========================
                // PUBLIC AUTH & AI & PREVIEW
                // =========================
                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login",
                    "/api/users/test",
                    "/api/ai/**"
                ).permitAll()

                // =========================
                // PUBLIC GET FOR FOODS & RESTAURANTS
                // =========================
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/restaurants/**",
                    "/api/foods/**"
                ).permitAll()

                // =========================
                // ADMIN ONLY MANAGEMENT
                // =========================
                .requestMatchers(HttpMethod.POST, "/api/restaurants/**", "/api/foods/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/restaurants/**", "/api/foods/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/restaurants/**", "/api/foods/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")

                // =========================
                // USER + ADMIN (ORDERS, CART, PAYMENTS)
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
