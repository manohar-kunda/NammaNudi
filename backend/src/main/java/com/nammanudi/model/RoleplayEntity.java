package com.nammanudi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "roleplays")
public class RoleplayEntity {

    @Id
    @Column(name = "scenario_slug", nullable = false, length = 64)
    private String scenarioSlug;

    @Column(nullable = false, length = 256)
    private String title;

    @Column(name = "start_node", nullable = false, length = 64)
    private String startNode;

    @Lob
    @Column(name = "nodes_json", nullable = false, columnDefinition = "CLOB")
    private String nodesJson;

    public RoleplayEntity() {}

    public RoleplayEntity(String scenarioSlug, String title, String startNode, String nodesJson) {
        this.scenarioSlug = scenarioSlug;
        this.title = title;
        this.startNode = startNode;
        this.nodesJson = nodesJson;
    }

    public String getScenarioSlug() {
        return scenarioSlug;
    }

    public void setScenarioSlug(String scenarioSlug) {
        this.scenarioSlug = scenarioSlug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStartNode() {
        return startNode;
    }

    public void setStartNode(String startNode) {
        this.startNode = startNode;
    }

    public String getNodesJson() {
        return nodesJson;
    }

    public void setNodesJson(String nodesJson) {
        this.nodesJson = nodesJson;
    }
}
