package com.nammanudi.repository;

import com.nammanudi.model.RoleplayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleplayRepository extends JpaRepository<RoleplayEntity, String> {
    Optional<RoleplayEntity> findByScenarioSlugIgnoreCase(String scenarioSlug);
}
