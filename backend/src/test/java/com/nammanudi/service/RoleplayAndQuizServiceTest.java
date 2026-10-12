package com.nammanudi.service;

import com.nammanudi.dto.QuestionDto;
import com.nammanudi.dto.RoleplayDto;
import com.nammanudi.exception.ScenarioNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
public class RoleplayAndQuizServiceTest {

    @Autowired
    private RoleplayService roleplayService;

    @Autowired
    private QuizService quizService;

    @Test
    void testGetRoleplayValid() {
        RoleplayDto roleplay = roleplayService.getRoleplayByScenario("transport");
        assertThat(roleplay).isNotNull();
        assertThat(roleplay.title()).isNotEmpty();
        assertThat(roleplay.start()).isNotEmpty();
        assertThat(roleplay.nodes()).isNotEmpty();
        assertThat(roleplay.nodes().get(roleplay.start())).isNotNull();
    }

    @Test
    void testGetRoleplayInvalidThrows() {
        assertThatThrownBy(() -> roleplayService.getRoleplayByScenario("fake_slug"))
                .isInstanceOf(ScenarioNotFoundException.class);
    }

    @Test
    void testGetQuizValid() {
        List<QuestionDto> quiz = quizService.getQuizByScenario("transport");
        assertThat(quiz).hasSize(5);
        QuestionDto first = quiz.getFirst();
        assertThat(first.options()).isNotEmpty();
        assertThat(first.answerIndex()).isBetween(0, first.options().size() - 1);
        assertThat(first.explanation()).isNotEmpty();
    }

    @Test
    void testGetQuizInvalidThrows() {
        assertThatThrownBy(() -> quizService.getQuizByScenario("non_existent"))
                .isInstanceOf(ScenarioNotFoundException.class);
    }
}
