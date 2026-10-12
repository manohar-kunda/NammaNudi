package com.nammanudi.service;

import com.nammanudi.dto.PhraseDto;
import com.nammanudi.exception.ScenarioNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
public class PhraseServiceTest {

    @Autowired
    private PhraseService phraseService;

    @Test
    void testGetPhrasesByValidScenario() {
        List<PhraseDto> phrases = phraseService.getPhrasesByScenario("transport");
        assertThat(phrases).hasSize(10);
        assertThat(phrases.getFirst().scenario()).isEqualTo("transport");
        assertThat(phrases.getFirst().example()).isNotNull();
        assertThat(phrases.getFirst().reviewed()).isFalse();
    }

    @Test
    void testGetPhrasesByInvalidScenarioThrows() {
        assertThatThrownBy(() -> phraseService.getPhrasesByScenario("non-existent"))
                .isInstanceOf(ScenarioNotFoundException.class)
                .hasMessageContaining("Scenario not found: non-existent");
    }

    @Test
    void testSearchPhrasesByTransliteration() {
        List<PhraseDto> results = phraseService.searchPhrases("majestic", null);
        assertThat(results).isNotEmpty();
        assertThat(results.stream().anyMatch(p -> p.id().equals("trans-01"))).isTrue();
    }

    @Test
    void testSearchPhrasesByKannadaScript() {
        List<PhraseDto> results = phraseService.searchPhrases("ದೋಸೆ", null);
        assertThat(results).isNotEmpty();
        assertThat(results.stream().anyMatch(p -> p.id().equals("rest-02"))).isTrue();
    }

    @Test
    void testSearchPhrasesByEnglish() {
        List<PhraseDto> results = phraseService.searchPhrases("headache", null);
        assertThat(results).isNotEmpty();
        assertThat(results.stream().anyMatch(p -> p.id().equals("health-01"))).isTrue();
    }

    @Test
    void testSearchPhrasesWithScenarioFilter() {
        List<PhraseDto> results = phraseService.searchPhrases("bill", "restaurant");
        assertThat(results).isNotEmpty();
        assertThat(results.stream().allMatch(p -> p.scenario().equalsIgnoreCase("restaurant"))).isTrue();
    }

    @Test
    void testSearchPhrasesWithInvalidScenarioThrows() {
        assertThatThrownBy(() -> phraseService.searchPhrases("test", "invalid_slug"))
                .isInstanceOf(ScenarioNotFoundException.class)
                .hasMessageContaining("Scenario not found: invalid_slug");
    }

    @Test
    void testSearchPhrasesEmptyQueryReturnsAllPhrasesCappedAt50() {
        List<PhraseDto> results = phraseService.searchPhrases("", null);
        assertThat(results).hasSize(50);

        List<PhraseDto> blankResults = phraseService.searchPhrases("   ", null);
        assertThat(blankResults).hasSize(50);
    }

    @Test
    void testSearchPhrasesQueryTooLongThrows() {
        String longQuery = "a".repeat(101);
        assertThatThrownBy(() -> phraseService.searchPhrases(longQuery, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Query string must not exceed 100 characters");
    }
}
