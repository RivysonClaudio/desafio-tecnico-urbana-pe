package com.urbanape.api.domain.users.dtos;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

import com.urbanape.api.domain.users.entities.UserRole;

public record UpdateUserRequestDTO(
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Name must contain only letters and spaces")
    String name,
    
    @Email(message = "Email must be valid")
    @Size(min = 1, max = 255, message = "Email must be between 1 and 255 characters")
    String email,
    
    UserRole role
) {}
