package com.nammanudi.service;

import com.nammanudi.dto.ScenarioDto;
import com.nammanudi.exception.ScenarioNotFoundException;
import com.nammanudi.model.ScenarioEntity;
import com.nammanudi.repository.ScenarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ScenarioService {

    private final ScenarioRepository scenarioRepository;

    public ScenarioService(ScenarioRepository scenarioRepository) {
        this.scenarioRepository = scenarioRepository;
    }

    public List<ScenarioDto> getAllScenarios() {
        return scenarioRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public ScenarioDto getScenarioBySlug(String slug) {
        return scenarioRepository.findBySlugIgnoreCase(slug)
                .map(this::toDto)
                .orElseThrow(() -> new ScenarioNotFoundException("Scenario not found: " + slug));
    }

    public boolean scenarioExists(String slug) {
        return scenarioRepository.existsBySlugIgnoreCase(slug);
    }

    private ScenarioDto toDto(ScenarioEntity entity) {
        return new ScenarioDto(
                entity.getId(),
                entity.getSlug(),
                entity.getTitle(),
                entity.getIcon(),
                entity.getPhraseCount()
        );
    }
}
