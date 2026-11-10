package com.foodbridge.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.foodbridge.backend.repository.UserRepository;
import com.foodbridge.backend.entity.User;

import java.util.Optional;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void resetPasswordsAndTest() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Check test123@gmail.com hash
        Optional<User> adminOpt = userRepository.findByEmail("test123@gmail.com");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            System.out.println("Current Admin Hash: " + admin.getPassword());
            System.out.println("Matches 'admin123': " + encoder.matches("admin123", admin.getPassword()));
            System.out.println("Matches 'keerdivi@2007': " + encoder.matches("keerdivi@2007", admin.getPassword()));
            System.out.println("Matches 'test123': " + encoder.matches("test123", admin.getPassword()));
            System.out.println("Matches '123456': " + encoder.matches("123456", admin.getPassword()));

            // Update to known password: "admin123"
            admin.setPassword(encoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Admin password updated to 'admin123'");
        }

        // Check divit@gmail.com
        Optional<User> userOpt = userRepository.findByEmail("divit@gmail.com");
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update to known password: "password123"
            user.setPassword(encoder.encode("password123"));
            userRepository.save(user);
            System.out.println("User divit@gmail.com password updated to 'password123'");
        }
    }
}
