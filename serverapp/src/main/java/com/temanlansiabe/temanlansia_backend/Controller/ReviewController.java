package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temanlansiabe.temanlansia_backend.Dto.ReviewDto;
import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Model.Review;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Service.ReviewService;

import jakarta.validation.Valid;
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
    public ResponseEntity<?> create(@Valid @RequestBody ReviewDto dto) {
        Review saved = reviewService.create(toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "Review created successfully", "data", saved));
    }

    // Update review
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody ReviewDto dto) {
        Review updated = reviewService.update(id, toEntity(dto));
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

    private Review toEntity(ReviewDto dto) {
        Review review = new Review();
        review.setRequest(requestRef(dto.getRequestId()));
        review.setReviewer(userRef(dto.getReviewerUserId()));
        review.setReviewee(userRef(dto.getRevieweeUserId()));
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return review;
    }

    private Request requestRef(Integer requestId) {
        Request request = new Request();
        request.setRequestId(requestId);
        return request;
    }

    private User userRef(Integer userId) {
        User user = new User();
        user.setUserId(userId);
        return user;
    }
}
