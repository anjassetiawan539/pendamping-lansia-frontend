package com.temanlansiabe.temanlansia_backend.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;
import com.temanlansiabe.temanlansia_backend.Repository.AssignmentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AssignmentService {
    private AssignmentRepository assignmentRepository;

    public List<Assignment> getAll() {
        return assignmentRepository.findAll();
    }

    public Assignment getById(Integer id) {
        return assignmentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));
    }

    public Assignment create(Assignment a) {
        return assignmentRepository.save(a);
    }

    public Assignment update(Integer id, Assignment a) {
        getById(id);
        a.setId(id);
        return assignmentRepository.save(a);
    }

    public void delete(Integer id) {
        Assignment a = getById(id);
        assignmentRepository.delete(a);
    }

    public List<Assignment> getByUserId(Integer userId) {
        return assignmentRepository.findByUserId(userId);
    }

    public List<Assignment> getByRequestId(Integer requestId) {
        return assignmentRepository.findByRequestId(requestId);
    }
}