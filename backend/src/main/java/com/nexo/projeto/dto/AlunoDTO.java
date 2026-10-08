package com.nexo.projeto.dto;

import java.util.List;

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
        int tarefasHoje,
        Long turmaId,
        String turmaNome,
        List<Long> materiaIds
) {
}
