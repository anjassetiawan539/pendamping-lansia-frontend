package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temanlansiabe.temanlansia_backend.Dto.UserRequestDto;
import com.temanlansiabe.temanlansia_backend.Dto.UserUpdateDto;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:9001")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // getAll
    @GetMapping
    public List<User> getAll(){
        return userService.getAll();
    }

    // getById
    @GetMapping("/{id}")
    public User getById(@PathVariable Integer id){
        return userService.getById(id);
    }

    // create
    @PostMapping
    public User create(@Valid @RequestBody UserRequestDto dto){
        return userService.create(toEntity(dto));
    }

    // update
    @PutMapping("/{id}")
    public User update(@PathVariable Integer id, @Valid @RequestBody UserUpdateDto dto){
        return userService.updatePartial(id, dto);
    }

    // delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        userService.delete(id);
    }

    private User toEntity(UserRequestDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFullname(dto.getFullname());
        user.setPhone(dto.getPhone());
        user.setProvince(dto.getProvince());
        user.setCity(dto.getCity());
        user.setAddressDetail(dto.getAddressDetail());
        user.setBio(dto.getBio());
        user.setRole(dto.getRole());
        return user;
    }
}
