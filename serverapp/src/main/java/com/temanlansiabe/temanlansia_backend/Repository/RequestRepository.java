package com.temanlansiabe.temanlansia_backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.Request;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findByLansia_UserId(Integer userId);
}
