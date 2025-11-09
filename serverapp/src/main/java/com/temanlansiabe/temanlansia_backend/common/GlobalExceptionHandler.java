package com.temanlansiabe.temanlansia_backend.common;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().stream()
            .findFirst()
            .map(error -> error instanceof FieldError fieldError ? fieldError.getDefaultMessage() : error.getDefaultMessage())
            .orElse("Data tidak valid.");
        return buildResponse(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
            .findFirst()
            .map(violation -> violation.getMessage())
            .orElse("Data tidak valid.");
        return buildResponse(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Data bentrok dengan data lain di sistem.");
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        if (status == null) {
            status = HttpStatus.BAD_REQUEST;
        }
        String message = ex.getReason() != null ? ex.getReason() : status.getReasonPhrase();
        return buildResponse(status, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Terjadi kesalahan pada server, coba beberapa saat lagi.");
    }

    private ResponseEntity<ApiResponse<Object>> buildResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status)
            .body(new ApiResponse<>(status.value(), message, null));
    }
}
