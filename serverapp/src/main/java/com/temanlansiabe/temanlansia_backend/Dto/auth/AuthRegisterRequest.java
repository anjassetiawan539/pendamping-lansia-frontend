package com.temanlansiabe.temanlansia_backend.Dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthRegisterRequest {

    private String fullname;

    private String phone;

    private String province;

    private String city;

    private String addressDetail;

    private String bio;

    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String role; // keluarga / relawan / admin
}
