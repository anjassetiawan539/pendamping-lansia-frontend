package com.temanlansiabe.temanlansia_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Model.User.Role;
import com.temanlansiabe.temanlansia_backend.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@Order(1)
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("admin")) {
            return;
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@gmail.com");
        admin.setPassword(passwordEncoder.encode("Admin1234"));
        admin.setRole(Role.ADMIN);
        admin.setFullname("Administrator");
        admin.setPhone("081200000000");
        admin.setProvince("DKI Jakarta");
        admin.setCity("Jakarta");
        admin.setAddressDetail("Office HQ");
        admin.setBio("Default admin account");

        userRepository.save(admin);
    }
}
