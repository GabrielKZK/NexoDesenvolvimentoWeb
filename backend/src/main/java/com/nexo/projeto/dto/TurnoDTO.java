package com.nexo.projeto.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record TurnoDTO(
        Long id,
        String nome,
        LocalTime horaInicio,
        LocalTime horaFim,
        Boolean ativo,
        LocalDateTime dataCadastro) {}