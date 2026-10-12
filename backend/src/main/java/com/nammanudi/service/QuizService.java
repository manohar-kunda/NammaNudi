package com.nammanudi.service;

import com.nammanudi.dto.QuestionDto;
import com.nammanudi.exception.ScenarioNotFoundException;
import com.nammanudi.model.QuizQuestionEntity;
import com.nammanudi.repository.QuizQuestionRepository;
import com.nammanudi.repository.ScenarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;
    private final ScenarioRepository scenarioRepository;
    private final ObjectMapper objectMapper;

    public QuizService(QuizQuestionRepository quizQuestionRepository,
                       ScenarioRepository scenarioRepository,
                       ObjectMapper objectMapper) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.scenarioRepository = scenarioRepository;
        this.objectMapper = objectMapper;
    }

    public List<QuestionDto> getQuizByScenario(String slug) {
        if (!scenarioRepository.existsBySlugIgnoreCase(slug)) {
            throw new ScenarioNotFoundException("Scenario not found: " + slug);
        }

        List<QuizQuestionEntity> questions = quizQuestionRepository.findByScenarioSlugIgnoreCase(slug);
        if (questions.isEmpty()) {
            throw new ScenarioNotFoundException("Quiz not found for scenario: " + slug);
        }

        return questions.stream()
                .map(this::toDto)
                .toList();
    }

    private QuestionDto toDto(QuizQuestionEntity entity) {
        try {
            List<String> options = objectMapper.readValue(
                    entity.getOptionsJson(),
                    new TypeReference<List<String>>() {}
            );
            return new QuestionDto(
                    entity.getId(),
                    entity.getPrompt(),
                    options,
                    entity.getAnswerIndex(),
                    entity.getExplanation()
            );
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse options for quiz question: " + entity.getId(), e);
        }
    }
}
