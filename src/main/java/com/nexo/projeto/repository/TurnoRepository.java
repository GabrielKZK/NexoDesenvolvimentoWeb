package com.nexo.projeto.repository;

import com.nexo.projeto.entity.TurnoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TurnoRepository extends JpaRepository<TurnoEntity, Long> {

    Optional<TurnoEntity> findByNome(String nome);

    boolean existsByNome(String nome);
}