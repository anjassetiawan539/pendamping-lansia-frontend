package com.temanlansiabe.temanlansia_backend.Dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private final String token;
    private final Integer userId;
    private final String email;
    private final String role;
}
