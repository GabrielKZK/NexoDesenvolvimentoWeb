package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.ProfessorDTO;
import com.nexo.projeto.entity.ProfessorEntity;
import org.springframework.stereotype.Component;

@Component
public class ProfessorMapper {

    public ProfessorDTO toDTO(ProfessorEntity entity){
        if (entity == null){
            return null;
        }return new ProfessorDTO(
                entity.getId(),
                entity.getNome(),
                entity.getEmail(),
                null,
                entity.getDisciplina(),
                entity.getTelefone(),
                entity.getAtivo(),
                entity.getDataCadastro()

        );
    }

    public ProfessorEntity toEntity(ProfessorDTO dto){
        if (dto == null){
            return null;
        }return ProfessorEntity.builder()
                .id(dto.id())
                .nome(dto.nome())
                .email(dto.email())
                .senha(dto.senha())
                .disciplina(dto.disciplina())
                .telefone(dto.telefone())
                .ativo(dto.ativo() != null ? dto.ativo() : true)
                .build();
    }
}
