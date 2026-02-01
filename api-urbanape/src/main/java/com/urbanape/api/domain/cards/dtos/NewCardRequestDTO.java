package com.urbanape.api.domain.cards.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.urbanape.api.domain.cards.entities.CardType;

public record NewCardRequestDTO(
    @NotNull(message = "User ID is required")
    Long userId,
    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 255 characters")
    String title,
    @NotNull(message = "Type is required")
    CardType type
) {}
