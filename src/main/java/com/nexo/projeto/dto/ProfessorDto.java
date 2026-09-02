package com.nexo.projeto.dto;

import java.time.LocalDateTime;

public record ProfessorDto(
        Long id,
        String nome,
        String email,
        String senha,
        String disciplina,
        String telefone,
        Boolean ativo,
        LocalDateTime localDateTime) {}
