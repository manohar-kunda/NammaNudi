package com.nammanudi;

import com.nammanudi.dto.QuestionDto;
import com.nammanudi.dto.RoleplayDto;
import com.nammanudi.dto.RoleplayNodeDto;
import com.nammanudi.dto.RoleplayOptionDto;
import com.nammanudi.model.QuizQuestionEntity;
import com.nammanudi.model.RoleplayEntity;
import com.nammanudi.model.ScenarioEntity;
import com.nammanudi.repository.QuizQuestionRepository;
import com.nammanudi.repository.RoleplayRepository;
import com.nammanudi.repository.ScenarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DataIntegrityTest {

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Autowired
    private RoleplayRepository roleplayRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRoleplayGraphIntegrity() throws Exception {
        List<ScenarioEntity> scenarios = scenarioRepository.findAll();
        assertThat(scenarios).isNotEmpty();

        for (ScenarioEntity scenario : scenarios) {
            String slug = scenario.getSlug();
            RoleplayEntity roleplayEntity = roleplayRepository.findByScenarioSlugIgnoreCase(slug)
                    .orElseThrow(() -> new AssertionError("Missing roleplay for scenario: " + slug));

            assertThat(roleplayEntity.getTitle()).as("Roleplay title for " + slug).isNotBlank();
            assertThat(roleplayEntity.getStartNode()).as("Start node for " + slug).isNotBlank();

            Map<String, RoleplayNodeDto> nodes = objectMapper.readValue(
                    roleplayEntity.getNodesJson(),
                    new TypeReference<Map<String, RoleplayNodeDto>>() {}
            );

            assertThat(nodes).as("Nodes map for " + slug).isNotEmpty();
            assertThat(nodes).as("Start node must exist in nodes for " + slug).containsKey(roleplayEntity.getStartNode());

            // 1. Every option's `next` is null or an existing node id
            for (Map.Entry<String, RoleplayNodeDto> entry : nodes.entrySet()) {
                String nodeId = entry.getKey();
                RoleplayNodeDto node = entry.getValue();

                assertThat(node.speaker()).as("Speaker of node " + nodeId + " in " + slug).isNotBlank();
                assertThat(node.kn()).as("Kannada text of node " + nodeId + " in " + slug).isNotBlank();
                assertThat(node.options()).as("Options of node " + nodeId + " in " + slug).isNotEmpty();

                for (RoleplayOptionDto option : node.options()) {
                    assertThat(option.quality())
                            .as("Quality of option in node " + nodeId + " in " + slug)
                            .isIn("good", "ok", "poor");

                    String next = option.next();
                    if (next != null) {
                        assertThat(nodes).as("Next node '%s' must exist in nodes for scenario '%s'", next, slug)
                                .containsKey(next);
                    }
                }
            }

            // 2. Every node is reachable from start
            Set<String> reachableNodes = new HashSet<>();
            Queue<String> queue = new ArrayDeque<>();
            queue.add(roleplayEntity.getStartNode());
            reachableNodes.add(roleplayEntity.getStartNode());

            while (!queue.isEmpty()) {
                String curr = queue.poll();
                RoleplayNodeDto node = nodes.get(curr);
                for (RoleplayOptionDto opt : node.options()) {
                    if (opt.next() != null && reachableNodes.add(opt.next())) {
                        queue.add(opt.next());
                    }
                }
            }

            assertThat(reachableNodes)
                    .as("All declared nodes must be reachable from start in scenario: " + slug)
                    .containsAll(nodes.keySet());

            // 3. Every path can reach a null ending (from every reachable node, there is a path to null)
            // Identify all nodes that have an option with next == null
            Set<String> canReachNull = new HashSet<>();
            Map<String, List<String>> reverseEdges = new HashMap<>();
            for (String nId : nodes.keySet()) {
                reverseEdges.put(nId, new ArrayList<>());
            }

            for (Map.Entry<String, RoleplayNodeDto> entry : nodes.entrySet()) {
                String u = entry.getKey();
                for (RoleplayOptionDto opt : entry.getValue().options()) {
                    if (opt.next() == null) {
                        canReachNull.add(u);
                    } else {
                        reverseEdges.get(opt.next()).add(u);
                    }
                }
            }

            // Reverse BFS to find all nodes that can reach a null transition
            Queue<String> revQueue = new ArrayDeque<>(canReachNull);
            while (!revQueue.isEmpty()) {
                String curr = revQueue.poll();
                for (String pred : reverseEdges.get(curr)) {
                    if (canReachNull.add(pred)) {
                        revQueue.add(pred);
                    }
                }
            }

            for (String nodeId : reachableNodes) {
                assertThat(canReachNull)
                        .as("Node '%s' in scenario '%s' must be able to reach a null ending", nodeId, slug)
                        .contains(nodeId);
            }
        }
    }

    @Test
    void testQuizDataIntegrity() throws Exception {
        List<QuizQuestionEntity> questions = quizQuestionRepository.findAll();
        assertThat(questions).isNotEmpty();

        for (QuizQuestionEntity q : questions) {
            assertThat(q.getPrompt()).as("Question prompt for ID: " + q.getId()).isNotBlank();
            assertThat(q.getExplanation()).as("Question explanation for ID: " + q.getId()).isNotBlank();

            List<String> options = objectMapper.readValue(
                    q.getOptionsJson(),
                    new TypeReference<List<String>>() {}
            );

            assertThat(options).as("Options for question: " + q.getId()).isNotEmpty();
            assertThat(options.size()).as("Options count for question: " + q.getId()).isGreaterThanOrEqualTo(2);

            // answerIndex is within options
            assertThat(q.getAnswerIndex())
                    .as("Answer index for question: " + q.getId())
                    .isGreaterThanOrEqualTo(0)
                    .isLessThan(options.size());
        }
    }
}
