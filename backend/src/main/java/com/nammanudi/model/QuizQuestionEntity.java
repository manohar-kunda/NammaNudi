package com.nammanudi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestionEntity {

    @Id
    @Column(nullable = false, length = 64)
    private String id;

    @Column(name = "scenario_slug", nullable = false, length = 64)
    private String scenarioSlug;

    @Column(nullable = false, length = 512)
    private String prompt;

    @Lob
    @Column(name = "options_json", nullable = false, columnDefinition = "CLOB")
    private String optionsJson;

    @Column(name = "answer_index", nullable = false)
    private int answerIndex;

    @Column(nullable = false, length = 1024)
    private String explanation;

    public QuizQuestionEntity() {}

    public QuizQuestionEntity(String id, String scenarioSlug, String prompt, String optionsJson,
                              int answerIndex, String explanation) {
        this.id = id;
        this.scenarioSlug = scenarioSlug;
        this.prompt = prompt;
        this.optionsJson = optionsJson;
        this.answerIndex = answerIndex;
        this.explanation = explanation;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getScenarioSlug() {
        return scenarioSlug;
    }

    public void setScenarioSlug(String scenarioSlug) {
        this.scenarioSlug = scenarioSlug;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getOptionsJson() {
        return optionsJson;
    }

    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
    }

    public int getAnswerIndex() {
        return answerIndex;
    }

    public void setAnswerIndex(int answerIndex) {
        this.answerIndex = answerIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
