package com.temanlansiabe.temanlansia_backend.Dto;

import com.temanlansiabe.temanlansia_backend.Model.User.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRequestDto {

    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String fullname;

    @Pattern(
        regexp = "^(\\\\+62|62|0)8[1-9][0-9]{6,9}$",
        message = "Nomor telepon harus format Indonesia, misal 0812xx atau +62812xx atau 62812xx"
    )
    private String phone;

    private String province;

    private String city;

    private String addressDetail;

    private String bio;

    @NotNull
    private Role role;
}
