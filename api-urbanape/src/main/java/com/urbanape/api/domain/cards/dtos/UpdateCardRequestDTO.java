package com.urbanape.api.domain.cards.dtos;

import jakarta.validation.constraints.Size;

import com.urbanape.api.domain.cards.entities.CardType;

public record UpdateCardRequestDTO(
    @Size(min = 1, max = 100, message = "Title must be between 1 and 255 characters")
    String title,
    Boolean status,
    CardType type
) {}
