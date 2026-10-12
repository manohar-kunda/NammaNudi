package com.nammanudi.service;

import com.nammanudi.dto.ExampleDto;
import com.nammanudi.dto.PhraseDto;
import com.nammanudi.exception.ScenarioNotFoundException;
import com.nammanudi.model.PhraseEntity;
import com.nammanudi.repository.PhraseRepository;
import com.nammanudi.repository.ScenarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PhraseService {

    private final PhraseRepository phraseRepository;
    private final ScenarioRepository scenarioRepository;

    public PhraseService(PhraseRepository phraseRepository, ScenarioRepository scenarioRepository) {
        this.phraseRepository = phraseRepository;
        this.scenarioRepository = scenarioRepository;
    }

    public List<PhraseDto> getPhrasesByScenario(String slug) {
        if (!scenarioRepository.existsBySlugIgnoreCase(slug)) {
            throw new ScenarioNotFoundException("Scenario not found: " + slug);
        }
        return phraseRepository.findByScenarioIgnoreCase(slug).stream()
                .map(this::toDto)
                .toList();
    }

    public List<PhraseDto> searchPhrases(String query, String scenario) {
        if (query != null && query.length() > 100) {
            throw new IllegalArgumentException("Query string must not exceed 100 characters");
        }
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanScenario = (scenario != null && !scenario.trim().isEmpty()) ? scenario.trim() : null;

        if (cleanScenario != null && !scenarioRepository.existsBySlugIgnoreCase(cleanScenario)) {
            throw new ScenarioNotFoundException("Scenario not found: " + cleanScenario);
        }

        return phraseRepository.searchPhrases(cleanQuery, cleanScenario, PageRequest.of(0, 50)).stream()
                .map(this::toDto)
                .toList();
    }

    public PhraseDto toDto(PhraseEntity entity) {
        ExampleDto example = new ExampleDto(
                entity.getExampleKn(),
                entity.getExampleTranslit(),
                entity.getExampleEn()
        );
        return new PhraseDto(
                entity.getId(),
                entity.getScenario(),
                entity.getKn(),
                entity.getTranslit(),
                entity.getEn(),
                example,
                entity.isReviewed()
        );
    }
}
