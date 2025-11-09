package com.temanlansiabe.temanlansia_backend.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.Review;
import com.temanlansiabe.temanlansia_backend.Repository.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReviewService {
    private ReviewRepository reviewRepository;

    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    public Review getById(Integer id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
    }

    public Review create(Review review) {
        // Validasi rating 1-5
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }
        return reviewRepository.save(review);
    }

    public Review update(Integer id, Review review) {
        getById(id); // Cek apakah review ada
        review.setReviewId(id);
        
        // Validasi rating
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }
        
        return reviewRepository.save(review);
    }

    public void delete(Integer id) {
        Review review = getById(id);
        reviewRepository.delete(review);
    }

    public List<Review> getByUserId(Integer userId) {
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> getByRequestId(Integer requestId) {
        return reviewRepository.findByRequestId(requestId);
    }
}
