package com.foodbridge.backend.repository;

import com.foodbridge.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUserId(Long userId);

    Optional<Cart> findByUserIdAndFoodId(Long userId, Long foodId);

    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
}
