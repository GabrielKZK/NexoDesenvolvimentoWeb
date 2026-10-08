package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.TurmaDTO;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.entity.Turma;
import org.springframework.stereotype.Component;

@Component
public class TurmaMapper {

    public TurmaDTO toDTO(Turma t) {
        Long idProfessor = null;
        String nomeProfessor = null;
        if (t.getProfessor() != null) {
            idProfessor = t.getProfessor().getId();
            nomeProfessor = t.getProfessor().getNome();
        }

        Long idTurno = null;
        String nomeTurno = null;
        if (t.getTurno() != null) {
            idTurno = t.getTurno().getId();
            nomeTurno = t.getTurno().getNome();
        }

        return new TurmaDTO(
                t.getId(),
                t.getNome(),
                t.getAnoLetivo(),
                idTurno,
                nomeTurno,
                idProfessor,
                nomeProfessor,
                t.getMaterias().stream().map(Materia::getId).toList()
        );
    }

    public Turma toEntity(TurmaDTO dto){
        Turma t = new Turma();

        t.setId(dto.id());
        t.setNome(dto.nome());
        t.setAnoLetivo(dto.anoLetivo());

        return t;
    }
}

