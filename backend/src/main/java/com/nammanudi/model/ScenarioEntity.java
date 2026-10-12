package com.nammanudi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "scenarios")
public class ScenarioEntity {

    @Id
    @Column(nullable = false, length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 64)
    private String slug;

    @Column(nullable = false, length = 128)
    private String title;

    @Column(nullable = false, length = 64)
    private String icon;

    @Column(nullable = false)
    private int phraseCount;

    public ScenarioEntity() {}

    public ScenarioEntity(String id, String slug, String title, String icon, int phraseCount) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.icon = icon;
        this.phraseCount = phraseCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getPhraseCount() {
        return phraseCount;
    }

    public void setPhraseCount(int phraseCount) {
        this.phraseCount = phraseCount;
    }
}
