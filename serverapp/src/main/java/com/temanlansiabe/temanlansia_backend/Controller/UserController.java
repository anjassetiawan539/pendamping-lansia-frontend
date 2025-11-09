package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Dto.UserRequestDto;
import com.temanlansiabe.temanlansia_backend.Dto.UserUpdateDto;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:9001")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAll(){
        return userService.getAll();
    }

    @GetMapping("/me")
    public User getCurrent(Authentication authentication) {
        return userService.getByUsername(authentication.getName());
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Integer id, Authentication authentication){
        ensureAccess(authentication, id);
        return userService.getById(id);
    }

    @PostMapping
    public User create(@Valid @RequestBody UserRequestDto dto){
        return userService.create(toEntity(dto));
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Integer id, @Valid @RequestBody UserUpdateDto dto, Authentication authentication){
        ensureAccess(authentication, id);
        return userService.updatePartial(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, Authentication authentication){
        ensureAccess(authentication, id);
        userService.delete(id);
    }

    private void ensureAccess(Authentication authentication, Integer requestedUserId) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Anda belum terautentikasi.");
        }
        if (isAdmin(authentication)) {
            return;
        }
        User current = userService.getByUsername(authentication.getName());
        if (!current.getUserId().equals(requestedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Anda tidak memiliki akses terhadap data ini.");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
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
