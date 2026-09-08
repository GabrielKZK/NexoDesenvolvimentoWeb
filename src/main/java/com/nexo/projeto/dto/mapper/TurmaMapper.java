package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.TurmaDto;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.entity.Turma;
import org.springframework.stereotype.Component;

@Component
public class TurmaMapper {

    public TurmaDto toDto(Turma t) {
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

        return new TurmaDto(
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

    public Turma toEntity(TurmaDto dto){
        Turma t = new Turma();

        t.setId(dto.id());
        t.setNome(dto.nome());
        t.setAnoLetivo(dto.anoLetivo());

        return t;
    }
}

