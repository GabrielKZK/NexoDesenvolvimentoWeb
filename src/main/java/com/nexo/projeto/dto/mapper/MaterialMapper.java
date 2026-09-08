package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.MateriaDto;
import com.nexo.projeto.entity.Aluno;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.entity.Turma;
import org.springframework.stereotype.Component;

@Component
public class MaterialMapper {
    public MateriaDto toDto(Materia m){

        return new MateriaDto(
                m.getId(),
                m.getNome(),
                m.getSegmento(),
                m.getTurmas().stream().map(Turma::getId).toList(),
                m.getAlunos().stream().map(Aluno::getId).toList())
                ;
    }

    public Materia toEntity(MateriaDto dto) {
        if (dto == null)
            return null;

        Materia m = new Materia();
        m.setId(dto.id());
        m.setNome(dto.nome());
        m.setSegmento(dto.segmento());

        return m;
    }
}
