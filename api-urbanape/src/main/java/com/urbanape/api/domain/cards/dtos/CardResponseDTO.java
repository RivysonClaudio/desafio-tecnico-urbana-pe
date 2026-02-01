package com.urbanape.api.domain.cards.dtos;

import com.urbanape.api.domain.cards.entities.CardType;

public record CardResponseDTO(
    Long number,
    String title,
    Boolean status,
    CardType type
) {}
