package com.nammanudi.controller;

import com.nammanudi.dto.PhraseDto;
import com.nammanudi.dto.QuestionDto;
import com.nammanudi.dto.RoleplayDto;
import com.nammanudi.dto.ScenarioDto;
import com.nammanudi.service.PhraseService;
import com.nammanudi.service.QuizService;
import com.nammanudi.service.RoleplayService;
import com.nammanudi.service.ScenarioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scenarios")
public class ScenarioController {

    private final ScenarioService scenarioService;
    private final PhraseService phraseService;
    private final RoleplayService roleplayService;
    private final QuizService quizService;

    public ScenarioController(ScenarioService scenarioService,
                              PhraseService phraseService,
                              RoleplayService roleplayService,
                              QuizService quizService) {
        this.scenarioService = scenarioService;
        this.phraseService = phraseService;
        this.roleplayService = roleplayService;
        this.quizService = quizService;
    }

    @GetMapping
    public List<ScenarioDto> getScenarios() {
        return scenarioService.getAllScenarios();
    }

    @GetMapping("/{slug}/phrases")
    public List<PhraseDto> getScenarioPhrases(@PathVariable String slug) {
        return phraseService.getPhrasesByScenario(slug);
    }

    @GetMapping("/{slug}/roleplay")
    public RoleplayDto getScenarioRoleplay(@PathVariable String slug) {
        return roleplayService.getRoleplayByScenario(slug);
    }

    @GetMapping("/{slug}/quiz")
    public List<QuestionDto> getScenarioQuiz(@PathVariable String slug) {
        return quizService.getQuizByScenario(slug);
    }
}
