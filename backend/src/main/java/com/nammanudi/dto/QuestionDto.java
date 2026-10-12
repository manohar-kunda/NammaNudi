package com.nammanudi.dto;

import java.util.List;

public record QuestionDto(
    String id,
    String prompt,
    List<String> options,
    int answerIndex,
    String explanation
) {}
