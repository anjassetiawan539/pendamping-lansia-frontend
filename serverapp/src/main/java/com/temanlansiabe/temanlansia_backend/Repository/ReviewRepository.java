package com.temanlansiabe.temanlansia_backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    // Custom query methods
    List<Review> findByUserId(Integer userId);
    List<Review> findByRequestId(Integer requestId);
    List<Review> findByRating(Integer rating);
}