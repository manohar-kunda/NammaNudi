package com.nammanudi.dto;

import java.util.List;

public record RoleplayNodeDto(
    String speaker,
    String kn,
    String translit,
    String en,
    List<RoleplayOptionDto> options
) {}
