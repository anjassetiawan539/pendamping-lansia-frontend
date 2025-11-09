package com.temanlansiabe.temanlansia_backend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Dto.auth.AuthLoginRequest;
import com.temanlansiabe.temanlansia_backend.Dto.auth.AuthRegisterRequest;
import com.temanlansiabe.temanlansia_backend.Dto.auth.AuthResponse;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Repository.UserRepository;
import com.temanlansiabe.temanlansia_backend.Service.UserService;
import com.temanlansiabe.temanlansia_backend.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:9001")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()) || userRepository.existsByUsername(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
        }

        User user = new User();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());
        user.setRole(mapRole(request.getRole()));

        User saved = userService.create(user);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(saved.getUsername())
            .password(saved.getPassword())
            .roles(saved.getRole().name())
            .build();
        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new AuthResponse(token, saved.getUserId(), saved.getEmail(), toClientRole(saved.getRole())));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthLoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email atau password salah"));

        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal());
        return new AuthResponse(token, user.getUserId(), user.getEmail(), toClientRole(user.getRole()));
    }

    private User.Role mapRole(String roleInput) {
        String normalized = roleInput.trim().toLowerCase();
        return switch (normalized) {
            case "admin" -> User.Role.ADMIN;
            case "relawan" -> User.Role.RELAWAN;
            default -> User.Role.LANSIA;
        };
    }

    private String toClientRole(User.Role role) {
        return switch (role) {
            case ADMIN -> "admin";
            case RELAWAN -> "relawan";
            default -> "keluarga";
        };
    }
}
