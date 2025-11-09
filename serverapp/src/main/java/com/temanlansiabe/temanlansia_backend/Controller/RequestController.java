package com.temanlansiabe.temanlansia_backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temanlansiabe.temanlansia_backend.Dto.RequestDto;
import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Model.User;
import com.temanlansiabe.temanlansia_backend.Service.RequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/request")
public class RequestController {
    private RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    // getAll
    @GetMapping
    public List<Request> getAll() {
        return requestService.getAll();
    }

    // getById
    @GetMapping("/{id}")
    public Request getById(@PathVariable Integer id) {
        return requestService.getById(id);
    }

    // create
    @PostMapping
    public Request create(@Valid @RequestBody RequestDto dto) {
        return requestService.create(toEntity(dto));
    }

    // update
    @PutMapping("/{id}")
    public Request update(@PathVariable Integer id, @Valid @RequestBody RequestDto dto) {
        return requestService.update(id, toEntity(dto));
    }

    // delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        requestService.delete(id);
    }

    private Request toEntity(RequestDto dto) {
        Request request = new Request();
        request.setLansia(userRef(dto.getLansiaUserId()));
        request.setLayanan(dto.getLayanan());
        request.setDeskripsi(dto.getDeskripsi());
        request.setStartTime(dto.getStartTime());
        request.setDuration(dto.getDuration());
        return request;
    }

    private User userRef(Integer userId) {
        User user = new User();
        user.setUserId(userId);
        return user;
    }
}
