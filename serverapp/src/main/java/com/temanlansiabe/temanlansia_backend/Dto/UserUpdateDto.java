package com.temanlansiabe.temanlansia_backend.Dto;

import com.temanlansiabe.temanlansia_backend.Model.User.Role;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserUpdateDto {

    private String username;

    @Email
    private String email;

    private String password;

    private Role role;

    private String fullname;

    private String phone;

    private String province;

    private String city;

    private String addressDetail;

    private String bio;
}
