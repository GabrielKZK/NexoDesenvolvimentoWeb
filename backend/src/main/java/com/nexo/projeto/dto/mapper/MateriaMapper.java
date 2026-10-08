package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.MateriaDTO;
import com.nexo.projeto.entity.Aluno;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.entity.Turma;
import org.springframework.stereotype.Component;

@Component
public class MateriaMapper {
    public MateriaDTO toDTO(Materia m){

        return new MateriaDTO(
                m.getId(),
                m.getNome(),
                m.getSegmento(),
                m.getTurmas().stream().map(Turma::getId).toList(),
                m.getAlunos().stream().map(Aluno::getId).toList())
                ;
    }

    public Materia toEntity(MateriaDTO dto) {
        if (dto == null)
            return null;

        Materia m = new Materia();
        m.setId(dto.id());
        m.setNome(dto.nome());
        m.setSegmento(dto.segmento());

        return m;
    }
}
