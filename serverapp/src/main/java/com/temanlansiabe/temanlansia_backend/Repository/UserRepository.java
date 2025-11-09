package com.temanlansiabe.temanlansia_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    java.util.Optional<User> findByUsername(String username);
}
