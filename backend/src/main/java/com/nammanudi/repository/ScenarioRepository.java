package com.nammanudi.repository;

import com.nammanudi.model.ScenarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScenarioRepository extends JpaRepository<ScenarioEntity, String> {
    Optional<ScenarioEntity> findBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCase(String slug);
}
