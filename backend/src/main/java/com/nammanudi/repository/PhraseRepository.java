package com.nammanudi.repository;

import com.nammanudi.model.PhraseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhraseRepository extends JpaRepository<PhraseEntity, String> {

    List<PhraseEntity> findByScenarioIgnoreCase(String scenario);

    long countByScenarioIgnoreCase(String scenario);

    @Query("""
        SELECT p FROM PhraseEntity p
        WHERE (:scenario IS NULL OR LOWER(p.scenario) = LOWER(:scenario))
          AND (:q IS NULL OR :q = '' OR
               LOWER(p.kn) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(p.translit) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(p.en) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY p.id ASC
    """)
    List<PhraseEntity> searchPhrases(@Param("q") String q,
                                     @Param("scenario") String scenario,
                                     Pageable pageable);
}
