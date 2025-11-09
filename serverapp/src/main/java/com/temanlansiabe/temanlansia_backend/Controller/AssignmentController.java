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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temanlansiabe.temanlansia_backend.Dto.AssignmentActionRequest;
import com.temanlansiabe.temanlansia_backend.Dto.AssignmentDto;
import com.temanlansiabe.temanlansia_backend.Model.Assignment;
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
    public List<Assignment> getAll() {
        return assignmentService.getAll();
    }

    @GetMapping("/{id}")
    public Assignment getById(@PathVariable Integer id) {
        return assignmentService.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AssignmentDto dto) {
        Assignment saved = assignmentService.assign(dto.getRequestId(), dto.getVolunteerUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Assignment created", "data", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        assignmentService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Assignment deleted"));
    }

    @GetMapping("/user/{userId}")
    public List<Assignment> byUser(@PathVariable Integer userId) {
        return assignmentService.getByUserId(userId);
    }

    @GetMapping("/request/{requestId}")
    public List<Assignment> byRequest(@PathVariable Integer requestId) {
        return assignmentService.getByRequestId(requestId);
    }

    @PostMapping("/{assignmentId}/accept")
    public ResponseEntity<?> accept(
        @PathVariable Integer assignmentId,
        @Valid @RequestBody AssignmentActionRequest dto
    ) {
        Assignment updated = assignmentService.accept(assignmentId, dto.getVolunteerUserId());
        return ResponseEntity.ok(Map.of("message", "Assignment accepted", "data", updated));
    }

    @PostMapping("/{assignmentId}/start")
    public ResponseEntity<?> start(
        @PathVariable Integer assignmentId,
        @Valid @RequestBody AssignmentActionRequest dto
    ) {
        Assignment updated = assignmentService.start(assignmentId, dto.getVolunteerUserId());
        return ResponseEntity.ok(Map.of("message", "Assignment started", "data", updated));
    }

    @PostMapping("/{assignmentId}/complete")
    public ResponseEntity<?> complete(
        @PathVariable Integer assignmentId,
        @Valid @RequestBody AssignmentActionRequest dto
    ) {
        Assignment updated = assignmentService.complete(assignmentId, dto.getVolunteerUserId());
        return ResponseEntity.ok(Map.of("message", "Assignment completed", "data", updated));
    }

}
