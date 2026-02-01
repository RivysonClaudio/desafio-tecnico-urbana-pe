package com.urbanape.api.infra.dtos;

public record ErrorValidationDTO(String field, String message, Object rejectedValue) {}
