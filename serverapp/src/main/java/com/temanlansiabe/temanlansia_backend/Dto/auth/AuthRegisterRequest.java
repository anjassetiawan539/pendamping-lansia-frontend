package com.temanlansiabe.temanlansia_backend.Dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthRegisterRequest {

    @NotBlank
    private String fullname;

    @NotBlank
    @Email
    private String email;

    @Pattern(
        regexp = "^(\\\\+62|62|0)8[1-9][0-9]{6,9}$",
        message = "Nomor telepon harus format Indonesia, misal 0812xx atau +62812xx atau 62812xx"
    )
    private String phone;

    @NotBlank
    private String password;

    @NotBlank
    private String role; // keluarga / relawan / admin
}
