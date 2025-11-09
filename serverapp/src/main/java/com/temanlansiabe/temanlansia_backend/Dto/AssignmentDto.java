package com.temanlansiabe.temanlansia_backend.Dto;

import com.temanlansiabe.temanlansia_backend.Model.Assignment.Status;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AssignmentDto {

    @NotNull
    private Integer requestId;

    @NotNull
    private Integer volunteerUserId;

    @NotNull
    private Status status;
}
