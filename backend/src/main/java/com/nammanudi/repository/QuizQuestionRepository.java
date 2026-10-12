package com.nammanudi.repository;

import com.nammanudi.model.QuizQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestionEntity, String> {
    List<QuizQuestionEntity> findByScenarioSlugIgnoreCase(String scenarioSlug);
}
