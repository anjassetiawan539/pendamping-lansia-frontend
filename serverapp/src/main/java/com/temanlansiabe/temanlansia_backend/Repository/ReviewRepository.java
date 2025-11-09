package com.temanlansiabe.temanlansia_backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT r FROM Review r WHERE r.reviewer.userId = :userId OR r.reviewee.userId = :userId")
    List<Review> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT r FROM Review r WHERE r.request.requestId = :requestId")
    List<Review> findByRequestId(@Param("requestId") Integer requestId);

    List<Review> findByRating(Integer rating);
}
