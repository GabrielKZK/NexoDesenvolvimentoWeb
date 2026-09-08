package com.nexo.projeto.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record MateriaDto(
        Long id,
        @NotBlank(message="Nome não pode estar vazio")
        String nome,
        @NotBlank(message = "Segmento não pode estar vazio")
        String segmento,
        List<Long> turmaIds,
        List<Long> alunoIds
) {
}
