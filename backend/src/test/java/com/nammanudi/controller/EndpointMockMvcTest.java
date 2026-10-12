package com.nammanudi.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EndpointMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void testGetScenarios() throws Exception {
        mockMvc.perform(get("/api/scenarios"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].slug").exists())
                .andExpect(jsonPath("$[0].title").exists())
                .andExpect(jsonPath("$[0].icon").exists())
                .andExpect(jsonPath("$[0].phraseCount").value(10));
    }

    @Test
    void testGetScenarioPhrasesValid() throws Exception {
        mockMvc.perform(get("/api/scenarios/transport/phrases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(10)))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].scenario").value("transport"))
                .andExpect(jsonPath("$[0].kn").exists())
                .andExpect(jsonPath("$[0].translit").exists())
                .andExpect(jsonPath("$[0].en").exists())
                .andExpect(jsonPath("$[0].example.kn").exists())
                .andExpect(jsonPath("$[0].reviewed").value(false));
    }

    @Test
    void testGetScenarioPhrasesNotFound() throws Exception {
        mockMvc.perform(get("/api/scenarios/invalid_slug/phrases"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", containsString("Scenario not found: invalid_slug")))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void testSearchPhrasesByQuery() throws Exception {
        mockMvc.perform(get("/api/phrases").param("q", "meter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())))
                .andExpect(jsonPath("$[0].id").value("trans-02"));
    }

    @Test
    void testSearchPhrasesByKannadaQuery() throws Exception {
        mockMvc.perform(get("/api/phrases").param("q", "ದೋಸೆ"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())))
                .andExpect(jsonPath("$[0].id").value("rest-02"));
    }

    @Test
    void testSearchPhrasesWithScenarioFilter() throws Exception {
        mockMvc.perform(get("/api/phrases").param("scenario", "shopping"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(10)))
                .andExpect(jsonPath("$[0].scenario").value("shopping"));
    }

    @Test
    void testSearchPhrasesWithInvalidScenario() throws Exception {
        mockMvc.perform(get("/api/phrases").param("scenario", "unknown_scenario"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void testGetScenarioRoleplayValid() throws Exception {
        mockMvc.perform(get("/api/scenarios/transport/roleplay"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").isNotEmpty())
                .andExpect(jsonPath("$.start").isNotEmpty())
                .andExpect(jsonPath("$.nodes").isMap())
                .andExpect(jsonPath("$.nodes.trans_node_1.speaker").value("Auto Driver"))
                .andExpect(jsonPath("$.nodes.trans_node_1.options", hasSize(3)))
                .andExpect(jsonPath("$.nodes.trans_node_1.options[0].quality", isIn(new String[]{"good", "ok", "poor"})));
    }

    @Test
    void testGetScenarioRoleplayNotFound() throws Exception {
        mockMvc.perform(get("/api/scenarios/unknown_roleplay/roleplay"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void testGetScenarioQuizValid() throws Exception {
        mockMvc.perform(get("/api/scenarios/transport/quiz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].prompt").isNotEmpty())
                .andExpect(jsonPath("$[0].options", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[0].answerIndex").isNumber())
                .andExpect(jsonPath("$[0].explanation").isNotEmpty());
    }

    @Test
    void testGetScenarioQuizNotFound() throws Exception {
        mockMvc.perform(get("/api/scenarios/unknown_quiz/quiz"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void testSearchPhrasesEmptyQueryReturnsAllPhrases() throws Exception {
        mockMvc.perform(get("/api/phrases").param("q", ""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(50)));
    }

    @Test
    void testSearchPhrasesQueryTooLongReturns400() throws Exception {
        mockMvc.perform(get("/api/phrases").param("q", "a".repeat(101)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error", containsString("Query string must not exceed 100 characters")));
    }

    @Test
    void testCorsAllowedOriginReceivesHeader() throws Exception {
        mockMvc.perform(get("/api/health")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void testCorsUnknownOriginDoesNotReceiveHeader() throws Exception {
        mockMvc.perform(get("/api/health")
                        .header("Origin", "http://unknown-domain.com"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
