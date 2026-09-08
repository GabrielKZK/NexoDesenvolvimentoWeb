package com.nexo.projeto.dto;

import jakarta.validation.constraints.NotNull;

public record TurmaDto (
    Long id,
    @NotNull(message = "A turma deve possuir um nome")
    String nome,
    @NotNull(message = "A turma deve ser de um ano letivo")
    Integer anoLetivo,
    @NotNull(message = "A turma deve possuir um turno")
    String turno,
    Long idProfessor,
    String nomeProfessor


){}
