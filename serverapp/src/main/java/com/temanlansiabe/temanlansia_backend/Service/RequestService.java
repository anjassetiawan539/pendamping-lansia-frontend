package com.temanlansiabe.temanlansia_backend.Service;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Model.Request.StatusType;
import com.temanlansiabe.temanlansia_backend.Repository.RequestRepository;
import com.temanlansiabe.temanlansia_backend.Repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RequestService {
    private static final Set<StatusType> ACTIVE_STATUSES = EnumSet.of(
        StatusType.OFFERED,
        StatusType.ASSIGNED,
        StatusType.ON_GOING
    );

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    // getAll
    public List<Request> getAll() {
        return requestRepository.findAll();
    }

    // getById
    public Request getById(Integer id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found!"));
    }

    // create
    public Request create(Request request) {
        User lansia = fetchValidatedLansia(request.getLansia());
        validateSchedule(lansia.getUserId(), request.getStartTime(), request.getDuration(), null);

        request.setLansia(lansia);
        request.setStatus(StatusType.OFFERED); // status awal dikontrol server
        return requestRepository.save(request);
    }

    // update
    public Request update(Integer id, Request incoming) {
        Request existing = getById(id);
        User lansia = fetchValidatedLansia(existing.getLansia());

        validateSchedule(lansia.getUserId(), incoming.getStartTime(), incoming.getDuration(), id);

        existing.setLayanan(incoming.getLayanan());
        existing.setDeskripsi(incoming.getDeskripsi());
        existing.setStartTime(incoming.getStartTime());
        existing.setDuration(incoming.getDuration());
        // Status tidak dapat diubah dari endpoint ini; transisi terjadi via flow server lain

        return requestRepository.save(existing);
    }

    // delete
    public void delete(Integer id) {
        Request request = getById(id); // Cek apakah request ada
        requestRepository.delete(request);
    }

    public List<Request> getByLansiaUserId(Integer userId) {
        return requestRepository.findByLansia_UserId(userId);
    }

    private User fetchValidatedLansia(User requested) {
        if (requested == null || requested.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lansia user id is required");
        }
        User user = userRepository.findById(requested.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User lansia tidak ditemukan"));

        if (user.getRole() != User.Role.LANSIA) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Request hanya dapat dibuat oleh akun lansia");
        }
        if (!StringUtils.hasText(user.getCity()) || !StringUtils.hasText(user.getProvince())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profil lansia harus memiliki kota & provinsi");
        }
        return user;
    }

    private void validateSchedule(Integer lansiaId, LocalDateTime startTime, Integer durationMinutes, Integer ignoreRequestId) {
        if (startTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time wajib diisi");
        }
        if (durationMinutes == null || durationMinutes <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Durasi harus lebih besar dari 0");
        }
        LocalDateTime now = LocalDateTime.now();
        if (startTime.isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time tidak boleh di masa lalu");
        }
        LocalDateTime endTime = startTime.plusMinutes(durationMinutes);

        List<Request> existingRequests = requestRepository.findByLansia_UserId(lansiaId);
        boolean overlaps = existingRequests.stream()
            .filter(r -> ignoreRequestId == null || !r.getRequestId().equals(ignoreRequestId))
            .filter(r -> ACTIVE_STATUSES.contains(r.getStatus()))
            .anyMatch(r -> isOverlapping(startTime, endTime, r.getStartTime(), r.getStartTime().plusMinutes(r.getDuration())));

        if (overlaps) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Jadwal bertabrakan dengan permintaan lain");
        }
    }

    private boolean isOverlapping(LocalDateTime newStart, LocalDateTime newEnd, LocalDateTime otherStart, LocalDateTime otherEnd) {
        return !newEnd.isBefore(otherStart) && !otherEnd.isBefore(newStart);
    }
}
