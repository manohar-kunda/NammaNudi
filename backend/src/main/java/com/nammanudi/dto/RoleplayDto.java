package com.nammanudi.dto;

import java.util.Map;

public record RoleplayDto(
    String title,
    String start,
    Map<String, RoleplayNodeDto> nodes
) {}
