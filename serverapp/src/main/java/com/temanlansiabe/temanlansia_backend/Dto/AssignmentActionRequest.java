package com.temanlansiabe.temanlansia_backend.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AssignmentActionRequest {

    @NotNull
    private Integer volunteerUserId;
}
