package com.temanlansiabe.temanlansia_backend.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public List<User> getAll(){
        return userRepository.findAll();
    }
    // getById
    public User getById(Integer id){
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Region not found!!" ));
    }
    // create
    public User create(User user){
        return userRepository.save(user);
    }
    // update
    public User update(Integer id, User user){
        getById(id);
        user.setUserId(id);
        return userRepository.save(user);
    }

    public void delete(Integer id) {
        User user = getById(id);
        userRepository.delete(user);
    }
}
