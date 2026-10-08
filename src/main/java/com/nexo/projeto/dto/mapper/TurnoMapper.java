package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.TurnoDTO;
import com.nexo.projeto.entity.TurnoEntity;
import org.springframework.stereotype.Component;

@Component
public class TurnoMapper {

    public TurnoDTO toDTO(TurnoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TurnoDTO(
                entity.getId(),
                entity.getNome(),
                entity.getHoraInicio(),
                entity.getHoraFim(),
                entity.getAtivo(),
                entity.getDataCadastro()
        );
    }

    public TurnoEntity toEntity(TurnoDTO dto) {
        if (dto == null) {
            return null;
        }
        return TurnoEntity.builder()
                .id(dto.id())
                .nome(dto.nome())
                .horaInicio(dto.horaInicio())
                .horaFim(dto.horaFim())
                .ativo(dto.ativo() != null ? dto.ativo() : true)
                .build();
    }
}