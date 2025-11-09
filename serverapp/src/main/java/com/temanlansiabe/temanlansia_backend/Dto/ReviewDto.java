package com.temanlansiabe.temanlansia_backend.Dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewDto {

    @NotNull
    private Integer requestId;

    @NotNull
    private Integer reviewerUserId;

    @NotNull
    private Integer revieweeUserId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;
}
