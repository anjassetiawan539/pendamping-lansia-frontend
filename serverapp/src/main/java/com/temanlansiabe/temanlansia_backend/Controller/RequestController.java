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

import com.temanlansiabe.temanlansia_backend.Model.Request;
import com.temanlansiabe.temanlansia_backend.Service.RequestService;

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
    public Request create(@RequestBody Request request) {
        return requestService.create(request);
    }

    // update
    @PutMapping("/{id}")
    public Request update(@PathVariable Integer id, @RequestBody Request request) {
        return requestService.update(id, request);
    }

    // delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        requestService.delete(id);
    }
}
