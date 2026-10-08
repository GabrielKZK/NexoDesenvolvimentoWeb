package com.nexo.projeto.repository;

import com.nexo.projeto.entity.Aluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByEmailInstitucional(String emailInstitucional);

    boolean existsByEmailInstitucional(String emailInstitucional);

    boolean existsByEmailInstitucionalAndIdNot(String emailInstitucional, Long id);

    List<Aluno> findByNomeContainingIgnoreCaseOrderByNomeAsc(String nome);

    Page<Aluno> findAllByOrderByXpTotalDescNomeAsc(Pageable pageable);

    List<Aluno> findTop10ByOrderByXpTotalDesc();

    List<Aluno> findTop10ByOrderByXpSemanaDesc();

    List<Aluno> findTop10ByOrderByOfensivaDiasDesc();

    @Query("SELECT COUNT(a) + 1 FROM Aluno a WHERE a.xpTotal > :xpTotal")
    long calcularPosicaoNoRanking(@Param("xpTotal") int xpTotal);

    @Query("SELECT a FROM Aluno a WHERE a.xpSemana >= a.metaSemanalXp AND a.metaSemanalXp > 0")
    List<Aluno> buscarQuemBateuMetaSemanal();

    @Query("SELECT a FROM Aluno a WHERE a.xpSemana < a.metaSemanalXp AND a.metaSemanalXp > 0")
    List<Aluno> buscarQuemNaoBateuMetaSemanal();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Aluno a SET a.xpTotal = a.xpTotal + :xp, a.xpSemana = a.xpSemana + :xp WHERE a.id = :id")
    int adicionarXp(@Param("id") Long id, @Param("xp") int xp);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Aluno a SET a.tarefasFeitasHoje = a.tarefasFeitasHoje + 1 WHERE a.id = :id")
    int registrarTarefaConcluida(@Param("id") Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Aluno a SET a.xpSemana = 0")
    int zerarXpSemanalDeTodos();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Aluno a SET a.ofensivaDias = a.ofensivaDias + 1 WHERE a.tarefasFeitasHoje > 0")
    int incrementarOfensivaDeQuemEstudou();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Aluno a SET a.ofensivaDias = 0 WHERE a.tarefasFeitasHoje = 0")
    int zerarOfensivaDeQuemFaltou();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Aluno a SET a.tarefasFeitasHoje = 0, a.tarefasHoje = 0")
    int zerarTarefasDoDia();
}
