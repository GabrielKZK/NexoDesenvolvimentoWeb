package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.TurmaDto;
import com.nexo.projeto.entity.Turma;
import org.springframework.stereotype.Component;

@Component
public class TurmaMapper {

    public TurmaDto toDto(Turma t) {
        Long idProfessor = null;
        String nomeProfessor = null;
    /*  ESPERANDO PROFESSOR PRONTO
        if(t.getProfessor() != null)
            idProfessor = t.getProfessor().getId();
            nomeProfessor = t.getProfessor().getNome();
    */
        return new TurmaDto(
                t.getId(),
                t.getNome(),
                t.getAnoLetivo(),
                t.getTurno(),
                idProfessor,
                nomeProfessor
        );
    }

    public Turma toEntity(TurmaDto dto){
        String professor = dto.nomeProfessor(); //aqui só por hora até professor pronto

        Turma t = new Turma();

        t.setId(dto.id());
        t.setNome(dto.nome());
        t.setAnoLetivo(dto.anoLetivo());
        t.setTurno(dto.turno());
        t.setProfessor(professor);

        return t;
    }
}

