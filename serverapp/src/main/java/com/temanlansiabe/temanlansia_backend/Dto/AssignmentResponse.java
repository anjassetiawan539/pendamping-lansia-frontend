package com.temanlansiabe.temanlansia_backend.Dto;

import java.time.Instant;
import java.time.LocalDateTime;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;
import com.temanlansiabe.temanlansia_backend.Model.Request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AssignmentResponse {
    private Integer assignmentId;
    private Assignment.Status status;
    private Instant createdAt;
    private Instant updatedAt;
    private RequestSummary request;
    private UserSummary volunteer;

    @Getter
    @Builder
    public static class RequestSummary {
        private Integer requestId;
        private String layanan;
        private String deskripsi;
        private LocalDateTime startTime;
        private Integer duration;
        private Request.StatusType status;
        private UserSummary lansia;
    }

    @Getter
    @Builder
    public static class UserSummary {
        private Integer userId;
        private String username;
        private String fullname;
        private String email;
    }
}
