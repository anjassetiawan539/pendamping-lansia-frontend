package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.temanlansiabe.temanlansia_backend.Model.Review;
import com.temanlansiabe.temanlansia_backend.Service.ReviewService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ReviewController {
    private ReviewService reviewService;

    // Get all reviews
    @GetMapping
    public List<Review> getAll() {
        return reviewService.getAll();
    }

    // Get review by ID
    @GetMapping("/{id}")
    public Review getById(@PathVariable Integer id) {
        return reviewService.getById(id);
    }

    // Create new review
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Review review) {
        Review saved = reviewService.create(review);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "Review created successfully", "data", saved));
    }

    // Update review
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Review review) {
        Review updated = reviewService.update(id, review);
        return ResponseEntity.ok(Map.of("message", "Review updated successfully", "data", updated));
    }

    // Delete review
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        reviewService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }

    // Get reviews by user
    @GetMapping("/user/{userId}")
    public List<Review> byUser(@PathVariable Integer userId) {
        return reviewService.getByUserId(userId);
    }

    // Get reviews by request
    @GetMapping("/request/{requestId}")
    public List<Review> byRequest(@PathVariable Integer requestId) {
        return reviewService.getByRequestId(requestId);
    }
}