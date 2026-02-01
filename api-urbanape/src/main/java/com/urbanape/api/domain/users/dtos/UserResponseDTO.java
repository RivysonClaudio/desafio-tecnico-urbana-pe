package com.urbanape.api.domain.users.dtos;

import java.util.List;

import com.urbanape.api.domain.users.entities.UserRole;

public record UserResponseDTO(
    Long id,
    String name,
    String email,
    UserRole role,
    List<Long> cardNumber
) {}
