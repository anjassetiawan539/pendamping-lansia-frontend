package com.temanlansiabe.temanlansia_backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    List<Assignment> findByUserId(Integer userId);
    List<Assignment> findByRequestId(Integer requestId);
    List<Assignment> findByStatus(Assignment.Status status);
}