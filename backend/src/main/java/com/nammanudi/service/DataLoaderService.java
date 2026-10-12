package com.nammanudi.service;

import com.nammanudi.dto.PhraseDto;
import com.nammanudi.dto.QuestionDto;
import com.nammanudi.dto.RoleplayDto;
import com.nammanudi.dto.ScenarioDto;
import com.nammanudi.model.PhraseEntity;
import com.nammanudi.model.QuizQuestionEntity;
import com.nammanudi.model.RoleplayEntity;
import com.nammanudi.model.ScenarioEntity;
import com.nammanudi.repository.PhraseRepository;
import com.nammanudi.repository.QuizQuestionRepository;
import com.nammanudi.repository.RoleplayRepository;
import com.nammanudi.repository.ScenarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@Service
public class DataLoaderService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoaderService.class);

    private final ScenarioRepository scenarioRepository;
    private final PhraseRepository phraseRepository;
    private final RoleplayRepository roleplayRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final ObjectMapper objectMapper;

    public DataLoaderService(ScenarioRepository scenarioRepository,
                             PhraseRepository phraseRepository,
                             RoleplayRepository roleplayRepository,
                             QuizQuestionRepository quizQuestionRepository,
                             ObjectMapper objectMapper) {
        this.scenarioRepository = scenarioRepository;
        this.phraseRepository = phraseRepository;
        this.roleplayRepository = roleplayRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting NammaNudi data seeding into H2 database...");
        loadScenarios();
        loadPhrases();
        loadRoleplay();
        loadQuiz();
        log.info("Data seeding completed successfully. Scenarios: {}, Phrases: {}, Roleplays: {}, Quizzes: {}",
                scenarioRepository.count(),
                phraseRepository.count(),
                roleplayRepository.count(),
                quizQuestionRepository.count());
    }

    private void loadScenarios() {
        try (InputStream is = openDataStream("scenarios.json")) {
            List<ScenarioDto> dtos = objectMapper.readValue(is, new TypeReference<List<ScenarioDto>>() {});
            List<ScenarioEntity> entities = dtos.stream()
                    .map(dto -> new ScenarioEntity(
                            dto.id(),
                            dto.slug(),
                            dto.title(),
                            dto.icon(),
                            dto.phraseCount()
                    ))
                    .toList();
            scenarioRepository.saveAll(entities);
            log.info("Loaded {} scenarios", entities.size());
        } catch (Exception e) {
            log.error("Failed to load scenarios.json", e);
            throw new IllegalStateException("Failed to load scenarios.json", e);
        }
    }

    private void loadPhrases() {
        try (InputStream is = openDataStream("phrases.json")) {
            List<PhraseDto> dtos = objectMapper.readValue(is, new TypeReference<List<PhraseDto>>() {});
            List<PhraseEntity> entities = dtos.stream()
                    .map(dto -> new PhraseEntity(
                            dto.id(),
                            dto.scenario(),
                            dto.kn(),
                            dto.translit(),
                            dto.en(),
                            dto.example() != null ? dto.example().kn() : null,
                            dto.example() != null ? dto.example().translit() : null,
                            dto.example() != null ? dto.example().en() : null,
                            dto.reviewed()
                    ))
                    .toList();
            phraseRepository.saveAll(entities);
            log.info("Loaded {} phrases", entities.size());

            // Ensure phraseCount in scenario matches actual phrases
            for (ScenarioEntity scenario : scenarioRepository.findAll()) {
                long count = phraseRepository.countByScenarioIgnoreCase(scenario.getSlug());
                if (count > 0 && scenario.getPhraseCount() != (int) count) {
                    scenario.setPhraseCount((int) count);
                    scenarioRepository.save(scenario);
                }
            }
        } catch (Exception e) {
            log.error("Failed to load phrases.json", e);
            throw new IllegalStateException("Failed to load phrases.json", e);
        }
    }

    private void loadRoleplay() {
        try (InputStream is = openDataStream("roleplay.json")) {
            Map<String, RoleplayDto> map = objectMapper.readValue(is, new TypeReference<Map<String, RoleplayDto>>() {});
            for (Map.Entry<String, RoleplayDto> entry : map.entrySet()) {
                String slug = entry.getKey();
                RoleplayDto dto = entry.getValue();
                String nodesJson = objectMapper.writeValueAsString(dto.nodes());
                RoleplayEntity entity = new RoleplayEntity(slug, dto.title(), dto.start(), nodesJson);
                roleplayRepository.save(entity);
            }
            log.info("Loaded {} roleplay scenarios", map.size());
        } catch (Exception e) {
            log.error("Failed to load roleplay.json", e);
            throw new IllegalStateException("Failed to load roleplay.json", e);
        }
    }

    private void loadQuiz() {
        try (InputStream is = openDataStream("quiz.json")) {
            Map<String, List<QuestionDto>> map = objectMapper.readValue(is, new TypeReference<Map<String, List<QuestionDto>>>() {});
            int totalQuestions = 0;
            for (Map.Entry<String, List<QuestionDto>> entry : map.entrySet()) {
                String slug = entry.getKey();
                List<QuestionDto> questions = entry.getValue();
                for (QuestionDto q : questions) {
                    String optionsJson = objectMapper.writeValueAsString(q.options());
                    QuizQuestionEntity entity = new QuizQuestionEntity(
                            q.id(),
                            slug,
                            q.prompt(),
                            optionsJson,
                            q.answerIndex(),
                            q.explanation()
                    );
                    quizQuestionRepository.save(entity);
                    totalQuestions++;
                }
            }
            log.info("Loaded {} quiz questions across scenarios", totalQuestions);
        } catch (Exception e) {
            log.error("Failed to load quiz.json", e);
            throw new IllegalStateException("Failed to load quiz.json", e);
        }
    }

    private InputStream openDataStream(String filename) throws IOException {
        ClassPathResource cpr = new ClassPathResource("data/" + filename);
        if (cpr.exists()) {
            return cpr.getInputStream();
        }

        // Fallbacks for direct local file systems
        Path p1 = Path.of("../data", filename);
        if (Files.exists(p1)) {
            return Files.newInputStream(p1);
        }
        Path p2 = Path.of("data", filename);
        if (Files.exists(p2)) {
            return Files.newInputStream(p2);
        }

        throw new IOException("Cannot locate data file: " + filename + " in classpath (data/" + filename + ") or relative file paths.");
    }
}
