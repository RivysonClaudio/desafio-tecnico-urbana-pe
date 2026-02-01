package com.urbanape.api.domain.cards.dtos;

import jakarta.validation.constraints.NotNull;

public record CardListByUserRequestDTO(
    @NotNull(message = "User ID is required")
    Long userId
) {}
