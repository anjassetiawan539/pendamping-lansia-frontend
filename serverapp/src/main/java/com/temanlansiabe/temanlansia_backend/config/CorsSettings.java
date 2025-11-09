package com.temanlansiabe.temanlansia_backend.config;

import java.util.List;

import lombok.experimental.UtilityClass;

@UtilityClass
public class CorsSettings {

    public static final List<String> ALLOWED_ORIGINS = List.of(
        "https://www.postman.com",
        "http://localhost:5173",
        "http://localhost:9001",
        "http://localhost:9000"
    );
}
