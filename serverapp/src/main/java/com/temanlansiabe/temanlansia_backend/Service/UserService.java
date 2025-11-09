package com.temanlansiabe.temanlansia_backend.Service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Dto.UserUpdateDto;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAll(){
        return userRepository.findAll();
    }

    public User getById(Integer id){
        return userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User create(User user){
        user.setPassword(encodePassword(user.getPassword()));
        return userRepository.save(user);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
    }

    public User updatePartial(Integer id, UserUpdateDto dto){
        User user = getById(id);

        if (dto.getUsername() != null) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(encodePassword(dto.getPassword()));
        }
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getFullname() != null) {
            user.setFullname(dto.getFullname());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        if (dto.getProvince() != null) {
            user.setProvince(dto.getProvince());
        }
        if (dto.getCity() != null) {
            user.setCity(dto.getCity());
        }
        if (dto.getAddressDetail() != null) {
            user.setAddressDetail(dto.getAddressDetail());
        }
        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }

        return userRepository.save(user);
    }

    public void delete(Integer id) {
        User user = getById(id);
        userRepository.delete(user);
    }

    private String encodePassword(String rawPassword) {
        if (rawPassword == null) {
            return null;
        }
        if (rawPassword.startsWith("$2a$") || rawPassword.startsWith("$2b$") || rawPassword.startsWith("$2y$")) {
            return rawPassword;
        }
        return passwordEncoder.encode(rawPassword);
    }
}
