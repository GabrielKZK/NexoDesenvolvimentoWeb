package com.nexo.projeto.repository;

import com.nexo.projeto.entity.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, Long> {

    Optional<ProfessorEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
