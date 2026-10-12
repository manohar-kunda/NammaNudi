package com.nammanudi.dto;

public record PhraseDto(
    String id,
    String scenario,
    String kn,
    String translit,
    String en,
    ExampleDto example,
    boolean reviewed
) {}
