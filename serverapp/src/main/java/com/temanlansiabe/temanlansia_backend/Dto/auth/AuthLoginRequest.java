package com.temanlansiabe.temanlansia_backend.Dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthLoginRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
