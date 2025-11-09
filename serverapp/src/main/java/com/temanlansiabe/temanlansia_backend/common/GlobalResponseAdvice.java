package com.temanlansiabe.temanlansia_backend.common;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@Component
public class GlobalResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
        Object body,
        MethodParameter returnType,
        MediaType selectedContentType,
        Class selectedConverterType,
        ServerHttpRequest request,
        ServerHttpResponse response
    ) {
        if (body instanceof ApiResponse) {
            return body;
        }

        HttpStatus status = HttpStatus.OK;
        if (response instanceof ServletServerHttpResponse servletResponse) {
            status = HttpStatus.resolve(servletResponse.getServletResponse().getStatus());
            if (status == null) {
                status = HttpStatus.OK;
            }
        }

        String message = resolveMessage(status);
        return new ApiResponse<>(status.value(), message, body);
    }

    private String resolveMessage(HttpStatus status) {
        return switch (status.series()) {
            case SUCCESSFUL -> "Permintaan berhasil diproses.";
            case REDIRECTION -> "Permintaan dialihkan, silakan ikuti lokasi baru.";
            case CLIENT_ERROR -> "Terjadi kesalahan pada data yang dikirim.";
            case SERVER_ERROR -> "Terjadi kesalahan pada server, coba beberapa saat lagi.";
            default -> "Respon diproses.";
        };
    }
}
