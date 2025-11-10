package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temanlansiabe.temanlansia_backend.Dto.AssignmentActionRequest;
import com.temanlansiabe.temanlansia_backend.Dto.AssignmentDto;
import com.temanlansiabe.temanlansia_backend.Dto.AssignmentResponse;
import com.temanlansiabe.temanlansia_backend.Model.Assignment;
import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Service.AssignmentService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class AssignmentController {
    private AssignmentService assignmentService;

    @GetMapping
    public List<AssignmentResponse> getAll() {
        return assignmentService.getAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AssignmentResponse getById(@PathVariable Integer id) {
        return toResponse(assignmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> create(@Valid @RequestBody AssignmentDto dto) {
        Assignment saved = assignmentService.assign(dto.getRequestId(), dto.getVolunteerUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        assignmentService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Assignment deleted"));
    }

    @GetMapping("/user/{userId}")
    public List<AssignmentResponse> byUser(@PathVariable Integer userId) {
        return assignmentService.getByUserId(userId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @GetMapping("/request/{requestId}")
    public List<AssignmentResponse> byRequest(@PathVariable Integer requestId) {
        return assignmentService.getByRequestId(requestId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @PostMapping("/{assignmentId}/accept")
    public ResponseEntity<AssignmentResponse> accept(
        @PathVariable Integer assignmentId,
        @Valid @RequestBody AssignmentActionRequest dto
    ) {
        Assignment updated = assignmentService.accept(assignmentId, dto.getVolunteerUserId());
        return ResponseEntity.ok(toResponse(updated));
    }

    @PostMapping("/{assignmentId}/start")
    public ResponseEntity<AssignmentResponse> start(
        @PathVariable Integer assignmentId,
        @Valid @RequestBody AssignmentActionRequest dto
    ) {
        Assignment updated = assignmentService.start(assignmentId, dto.getVolunteerUserId());
        return ResponseEntity.ok(toResponse(updated));
    }

    @PostMapping("/{assignmentId}/complete")
    public ResponseEntity<AssignmentResponse> complete(
        @PathVariable Integer assignmentId,
        @Valid @RequestBody AssignmentActionRequest dto
    ) {
        Assignment updated = assignmentService.complete(assignmentId, dto.getVolunteerUserId());
        return ResponseEntity.ok(toResponse(updated));
    }

    private AssignmentResponse toResponse(Assignment assignment) {
        Request request = assignment.getRequest();
        User volunteer = assignment.getVolunteer();

        AssignmentResponse.UserSummary volunteerSummary = mapUser(volunteer);
        AssignmentResponse.UserSummary lansiaSummary = request != null ? mapUser(request.getLansia()) : null;

        AssignmentResponse.RequestSummary requestSummary = request == null ? null : AssignmentResponse.RequestSummary.builder()
            .requestId(request.getRequestId())
            .layanan(request.getLayanan())
            .deskripsi(request.getDeskripsi())
            .startTime(request.getStartTime())
            .duration(request.getDuration())
            .status(request.getStatus())
            .lansia(lansiaSummary)
            .build();

        return AssignmentResponse.builder()
            .assignmentId(assignment.getAssignmentId())
            .status(assignment.getStatus())
            .createdAt(assignment.getCreatedAt())
            .updatedAt(assignment.getUpdatedAt())
            .request(requestSummary)
            .volunteer(volunteerSummary)
            .build();
    }

    private AssignmentResponse.UserSummary mapUser(User user) {
        if (user == null) {
            return null;
        }
        return AssignmentResponse.UserSummary.builder()
            .userId(user.getUserId())
            .username(user.getUsername())
            .fullname(user.getFullname())
            .email(user.getEmail())
            .build();
    }

}
