package com.temanlansiabe.temanlansia_backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    @Query("SELECT a FROM Assignment a WHERE a.volunteer.userId = :userId")
    List<Assignment> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT a FROM Assignment a WHERE a.request.requestId = :requestId")
    List<Assignment> findByRequestId(@Param("requestId") Integer requestId);

    List<Assignment> findByStatus(Assignment.Status status);
}
