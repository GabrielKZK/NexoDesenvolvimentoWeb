package com.nexo.projeto.dto;

public record AlunoDTO(
        Long id,
        String nome,
        String emailInstitucional,
        String foto,
        int xpTotal,
        int xpSemana,
        int metaSemanalXp,
        int ofensivaDias,
        int tarefasFeitasHoje,
        int tarefasHoje
) {
}
