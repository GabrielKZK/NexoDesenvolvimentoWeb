package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.TurnoDto;
import com.nexo.projeto.entity.TurnoEntity;
import org.springframework.stereotype.Component;

@Component
public class TurnoMapper {

    public TurnoDto toDto(TurnoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TurnoDto(
                entity.getId(),
                entity.getNome(),
                entity.getHoraInicio(),
                entity.getHoraFim(),
                entity.getAtivo(),
                entity.getDataCadastro()
        );
    }

    public TurnoEntity toEntity(TurnoDto dto) {
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