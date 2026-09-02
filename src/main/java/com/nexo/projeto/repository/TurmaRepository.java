package com.nexo.projeto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nexo.projeto.entity.Turma;

@Repository
public interface    TurmaRepository extends JpaRepository<Turma, Long>{

    List<Turma> findAllByNomeLike(String nome);
    
}
