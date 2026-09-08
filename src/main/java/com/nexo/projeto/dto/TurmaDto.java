package com.nexo.projeto.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TurmaDto (
    Long id,
    @NotNull(message = "A turma deve possuir um nome")
    String nome,
    @NotNull(message = "A turma deve ser de um ano letivo")
    Integer anoLetivo,
    Long idTurno,
    String nomeTurno,
    Long idProfessor,
    String nomeProfessor,
    List<Long> materiaIds

){}
