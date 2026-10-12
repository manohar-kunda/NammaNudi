package com.nammanudi.service;

import com.nammanudi.dto.RoleplayDto;
import com.nammanudi.dto.RoleplayNodeDto;
import com.nammanudi.exception.ScenarioNotFoundException;
import com.nammanudi.model.RoleplayEntity;
import com.nammanudi.repository.RoleplayRepository;
import com.nammanudi.repository.ScenarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
@Transactional(readOnly = true)
public class RoleplayService {

    private final RoleplayRepository roleplayRepository;
    private final ScenarioRepository scenarioRepository;
    private final ObjectMapper objectMapper;

    public RoleplayService(RoleplayRepository roleplayRepository,
                           ScenarioRepository scenarioRepository,
                           ObjectMapper objectMapper) {
        this.roleplayRepository = roleplayRepository;
        this.scenarioRepository = scenarioRepository;
        this.objectMapper = objectMapper;
    }

    public RoleplayDto getRoleplayByScenario(String slug) {
        if (!scenarioRepository.existsBySlugIgnoreCase(slug)) {
            throw new ScenarioNotFoundException("Scenario not found: " + slug);
        }

        RoleplayEntity entity = roleplayRepository.findByScenarioSlugIgnoreCase(slug)
                .orElseThrow(() -> new ScenarioNotFoundException("Roleplay not found for scenario: " + slug));

        try {
            Map<String, RoleplayNodeDto> nodes = objectMapper.readValue(
                    entity.getNodesJson(),
                    new TypeReference<Map<String, RoleplayNodeDto>>() {}
            );
            return new RoleplayDto(entity.getTitle(), entity.getStartNode(), nodes);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse roleplay nodes for scenario: " + slug, e);
        }
    }
}
