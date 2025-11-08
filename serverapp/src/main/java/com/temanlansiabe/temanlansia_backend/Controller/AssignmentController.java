package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;
import com.temanlansiabe.temanlansia_backend.Service.AssignmentService;

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
    public ResponseEntity<?> create(@RequestBody Assignment a) {
        Assignment saved = assignmentService.create(a);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Assignment created", "data", saved));
    }

    @PutMapping("/{id}")
    public Assignment update(@PathVariable Integer id, @RequestBody Assignment a) {
        return assignmentService.update(id, a);
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
}