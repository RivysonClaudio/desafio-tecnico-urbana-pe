package com.urbanape.api.domain.cards.dtos;

import java.util.Set;

public record DeleteCardListRequestDTO(
    Set<Long> numbers
) {}
