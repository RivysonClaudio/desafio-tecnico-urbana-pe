package com.urbanape.api.domain.users.dtos;

import java.util.Set;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record DeleteUserListRequestDTO(
    @NotNull(message = "Ids is required")
    @NotEmpty(message = "Ids must not be empty")
    @Size(min = 1, message = "Ids must contain at least one id")
    Set<Long> ids
) {}
