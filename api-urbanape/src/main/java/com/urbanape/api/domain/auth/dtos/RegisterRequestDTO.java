package com.urbanape.api.domain.auth.dtos;

import com.urbanape.api.domain.users.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(

    @NotBlank(message = "Name is required")
    @NotNull(message = "Name is required")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Name must contain only letters and spaces")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    String name,
    
    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    @Email(message = "Invalid email")
    String email,
    
    @NotBlank(message = "Password is required")
    @NotNull(message = "Password is required")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])[\\S]{8,}$", 
        message = "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )
    String password,

    @NotNull(message = "Role is required and must be ADMIN or USER")
    UserRole role
) {}
