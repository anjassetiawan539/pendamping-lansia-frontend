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

import com.temanlansiabe.temanlansia_backend.Dto.AssignmentDto;
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
    public List<Assignment> getAll() {
        return assignmentService.getAll();
    }

    @GetMapping("/{id}")
    public Assignment getById(@PathVariable Integer id) {
        return assignmentService.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AssignmentDto dto) {
        Assignment saved = assignmentService.create(toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Assignment created", "data", saved));
    }

    @PutMapping("/{id}")
    public Assignment update(@PathVariable Integer id, @Valid @RequestBody AssignmentDto dto) {
        return assignmentService.update(id, toEntity(dto));
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

    private Assignment toEntity(AssignmentDto dto) {
        Assignment assignment = new Assignment();
        assignment.setRequest(requestRef(dto.getRequestId()));
        assignment.setVolunteer(userRef(dto.getVolunteerUserId()));
        assignment.setStatus(dto.getStatus());
        return assignment;
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
