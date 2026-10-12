package com.nammanudi;

import com.nammanudi.repository.PhraseRepository;
import com.nammanudi.repository.QuizQuestionRepository;
import com.nammanudi.repository.RoleplayRepository;
import com.nammanudi.repository.ScenarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DataLoadedCountTest {

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Autowired
    private PhraseRepository phraseRepository;

    @Autowired
    private RoleplayRepository roleplayRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Test
    void testLoadedCountsMatchJsonFiles() {
        // Scenarios count must match 5 scenarios in /data/scenarios.json
        assertThat(scenarioRepository.count()).isEqualTo(5);

        // Phrases count must match 50 phrases in /data/phrases.json
        assertThat(phraseRepository.count()).isEqualTo(50);

        // Each scenario must have exactly 10 phrases
        assertThat(phraseRepository.countByScenarioIgnoreCase("transport")).isEqualTo(10);
        assertThat(phraseRepository.countByScenarioIgnoreCase("shopping")).isEqualTo(10);
        assertThat(phraseRepository.countByScenarioIgnoreCase("healthcare")).isEqualTo(10);
        assertThat(phraseRepository.countByScenarioIgnoreCase("workplace")).isEqualTo(10);
        assertThat(phraseRepository.countByScenarioIgnoreCase("restaurant")).isEqualTo(10);

        // All phrases must have reviewed == false per content rules
        long unreviewedCount = phraseRepository.findAll().stream()
                .filter(p -> !p.isReviewed())
                .count();
        assertThat(unreviewedCount).isEqualTo(50);

        // Roleplay dialogues: exactly 5 scenarios
        assertThat(roleplayRepository.count()).isEqualTo(5);

        // Quiz questions: exactly 25 questions (5 per scenario)
        assertThat(quizQuestionRepository.count()).isEqualTo(25);
        assertThat(quizQuestionRepository.findByScenarioSlugIgnoreCase("transport")).hasSize(5);
        assertThat(quizQuestionRepository.findByScenarioSlugIgnoreCase("shopping")).hasSize(5);
        assertThat(quizQuestionRepository.findByScenarioSlugIgnoreCase("healthcare")).hasSize(5);
        assertThat(quizQuestionRepository.findByScenarioSlugIgnoreCase("workplace")).hasSize(5);
        assertThat(quizQuestionRepository.findByScenarioSlugIgnoreCase("restaurant")).hasSize(5);
    }
}
