package com.temanlansiabe.temanlansia_backend.Dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestDto {

    @NotNull
    private Integer lansiaUserId;

    @NotBlank
    private String layanan;

    @NotBlank
    private String deskripsi;

    @NotNull
    @FutureOrPresent
    private LocalDateTime startTime;

    @NotNull
    @Positive
    private Integer duration;

    // Status akan ditentukan server, tidak diterima dari klien
}
