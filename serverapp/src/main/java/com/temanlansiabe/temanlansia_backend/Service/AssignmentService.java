package com.temanlansiabe.temanlansia_backend.Service;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.Assignment;
import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Model.Assignment.Status;
import com.temanlansiabe.temanlansia_backend.Model.Request.StatusType;
import com.temanlansiabe.temanlansia_backend.Repository.AssignmentRepository;
import com.temanlansiabe.temanlansia_backend.Repository.RequestRepository;
import com.temanlansiabe.temanlansia_backend.Repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    public List<Assignment> getAll() {
        return assignmentRepository.findAll();
    }

    public Assignment getById(Integer id) {
        return assignmentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));
    }

    @Transactional
    public Assignment assign(Integer requestId, Integer volunteerUserId) {
        Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request tidak ditemukan"));
        if (request.getStatus() != StatusType.OFFERED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request tidak tersedia untuk assignment");
        }
        if (!assignmentRepository.findByRequestId(requestId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request sudah memiliki assignment");
        }

        User volunteer = fetchVolunteer(volunteerUserId);

        Assignment assignment = new Assignment();
        assignment.setRequest(request);
        assignment.setVolunteer(volunteer);
        assignment.setStatus(Status.SCHEDULED);

        Assignment saved = assignmentRepository.save(assignment);
        request.setStatus(StatusType.ASSIGNED);
        requestRepository.save(request);
        return saved;
    }

    @Transactional
    public Assignment accept(Integer assignmentId, Integer volunteerUserId) {
        Assignment assignment = getById(assignmentId);
        ensureVolunteerOwnership(assignment, volunteerUserId);
        ensureAssignmentStatus(assignment, Status.SCHEDULED, "Assignment tidak dapat diterima");
        Request request = assignment.getRequest();
        ensureRequestStatus(request, StatusType.ASSIGNED, "Status request tidak valid untuk accept");

        assignment.setStatus(Status.ACCEPTED);
        request.setAcceptedAt(Instant.now());
        requestRepository.save(request);
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public Assignment start(Integer assignmentId, Integer volunteerUserId) {
        Assignment assignment = getById(assignmentId);
        ensureVolunteerOwnership(assignment, volunteerUserId);
        ensureAssignmentStatus(assignment, Status.ACCEPTED, "Assignment belum diterima");
        Request request = assignment.getRequest();
        ensureRequestStatus(request, StatusType.ASSIGNED, "Request belum siap dimulai");

        assignment.setStatus(Status.IN_PROGRESS);
        request.setStatus(StatusType.ON_GOING);
        request.setStartedAt(Instant.now());

        requestRepository.save(request);
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public Assignment complete(Integer assignmentId, Integer volunteerUserId) {
        Assignment assignment = getById(assignmentId);
        ensureVolunteerOwnership(assignment, volunteerUserId);
        ensureAssignmentStatus(assignment, Status.IN_PROGRESS, "Assignment belum berjalan");
        Request request = assignment.getRequest();
        ensureRequestStatus(request, StatusType.ON_GOING, "Request belum berjalan");

        assignment.setStatus(Status.COMPLETE);
        request.setStatus(StatusType.DONE);
        request.setCompletedAt(Instant.now());

        requestRepository.save(request);
        return assignmentRepository.save(assignment);
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

    private User fetchVolunteer(Integer volunteerUserId) {
        User volunteer = userRepository.findById(volunteerUserId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Relawan tidak ditemukan"));
        if (volunteer.getRole() != User.Role.RELAWAN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment hanya untuk akun relawan");
        }
        return volunteer;
    }

    private void ensureVolunteerOwnership(Assignment assignment, Integer volunteerUserId) {
        if (!assignment.getVolunteer().getUserId().equals(volunteerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Relawan tidak memiliki assignment ini");
        }
    }

    private void ensureAssignmentStatus(Assignment assignment, Status expected, String message) {
        if (assignment.getStatus() != expected) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private void ensureRequestStatus(Request request, StatusType expected, String message) {
        if (request.getStatus() != expected) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }
}
