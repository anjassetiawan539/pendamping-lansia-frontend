package com.temanlansiabe.temanlansia_backend.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Repository.RequestRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RequestService {
    private RequestRepository requestRepository;

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
        return requestRepository.save(request);
    }

    // update
    public Request update(Integer id, Request request) {
        getById(id); // Cek apakah request ada
        request.setId(id);
        return requestRepository.save(request);
    }

    // delete
    public void delete(Integer id) {
        Request request = getById(id); // Cek apakah request ada
        requestRepository.delete(request);
    }
}