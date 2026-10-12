package com.nammanudi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "phrases")
public class PhraseEntity {

    @Id
    @Column(nullable = false, length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String scenario;

    @Column(nullable = false, length = 512)
    private String kn;

    @Column(nullable = false, length = 512)
    private String translit;

    @Column(nullable = false, length = 512)
    private String en;

    @Column(name = "example_kn", length = 512)
    private String exampleKn;

    @Column(name = "example_translit", length = 512)
    private String exampleTranslit;

    @Column(name = "example_en", length = 512)
    private String exampleEn;

    @Column(nullable = false)
    private boolean reviewed;

    public PhraseEntity() {}

    public PhraseEntity(String id, String scenario, String kn, String translit, String en,
                        String exampleKn, String exampleTranslit, String exampleEn, boolean reviewed) {
        this.id = id;
        this.scenario = scenario;
        this.kn = kn;
        this.translit = translit;
        this.en = en;
        this.exampleKn = exampleKn;
        this.exampleTranslit = exampleTranslit;
        this.exampleEn = exampleEn;
        this.reviewed = reviewed;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getScenario() {
        return scenario;
    }

    public void setScenario(String scenario) {
        this.scenario = scenario;
    }

    public String getKn() {
        return kn;
    }

    public void setKn(String kn) {
        this.kn = kn;
    }

    public String getTranslit() {
        return translit;
    }

    public void setTranslit(String translit) {
        this.translit = translit;
    }

    public String getEn() {
        return en;
    }

    public void setEn(String en) {
        this.en = en;
    }

    public String getExampleKn() {
        return exampleKn;
    }

    public void setExampleKn(String exampleKn) {
        this.exampleKn = exampleKn;
    }

    public String getExampleTranslit() {
        return exampleTranslit;
    }

    public void setExampleTranslit(String exampleTranslit) {
        this.exampleTranslit = exampleTranslit;
    }

    public String getExampleEn() {
        return exampleEn;
    }

    public void setExampleEn(String exampleEn) {
        this.exampleEn = exampleEn;
    }

    public boolean isReviewed() {
        return reviewed;
    }

    public void setReviewed(boolean reviewed) {
        this.reviewed = reviewed;
    }
}
