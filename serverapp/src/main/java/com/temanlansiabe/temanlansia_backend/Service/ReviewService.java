package com.temanlansiabe.temanlansia_backend.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;
import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Model.Review;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Model.Request.StatusType;
import com.temanlansiabe.temanlansia_backend.Repository.AssignmentRepository;
import com.temanlansiabe.temanlansia_backend.Repository.RequestRepository;
import com.temanlansiabe.temanlansia_backend.Repository.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final RequestRepository requestRepository;
    private final AssignmentRepository assignmentRepository;

    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    public Review getById(Integer id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
    }

    public Review create(Review review) {
        validateRating(review.getRating());
        Request request = loadRequest(review.getRequest());
        ensureRequestDone(request);

        Assignment assignment = assignmentRepository.findByRequestId(request.getRequestId()).stream().findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request belum memiliki assignment"));

        User lansia = request.getLansia();
        User volunteer = assignment.getVolunteer();
        ensureReviewerPair(review, lansia, volunteer);

        review.setRequest(request);
        review.setReviewer(lansia);
        review.setReviewee(volunteer);

        return reviewRepository.save(review);
    }

    public Review update(Integer id, Review incoming) {
        Review existing = getById(id);
        validateRating(incoming.getRating());

        existing.setRating(incoming.getRating());
        existing.setComment(incoming.getComment());

        return reviewRepository.save(existing);
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

    private void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }
    }

    private Request loadRequest(Request requestRef) {
        if (requestRef == null || requestRef.getRequestId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request id is required for review");
        }
        return requestRepository.findById(requestRef.getRequestId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request tidak ditemukan"));
    }

    private void ensureRequestDone(Request request) {
        if (request.getStatus() != StatusType.DONE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review hanya dapat dibuat setelah layanan selesai");
        }
        if (request.getCompletedAt() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request belum tercatat selesai");
        }
    }

    private void ensureReviewerPair(Review review, User lansia, User volunteer) {
        Integer reviewerId = review.getReviewer() != null ? review.getReviewer().getUserId() : null;
        Integer revieweeId = review.getReviewee() != null ? review.getReviewee().getUserId() : null;

        if (reviewerId == null || revieweeId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reviewer dan reviewee wajib diisi");
        }

        if (!lansia.getUserId().equals(reviewerId) || !volunteer.getUserId().equals(revieweeId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Hanya lansia yang dapat menilai relawan setelah layanan selesai");
        }
    }
}
