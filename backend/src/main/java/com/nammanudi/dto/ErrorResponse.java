package com.nammanudi.dto;

public record ErrorResponse(
    String error,
    int status
) {}
