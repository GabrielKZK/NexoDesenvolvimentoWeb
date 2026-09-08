package com.nexo.projeto.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record TurnoDto(
        Long id,
        String nome,
        LocalTime horaInicio,
        LocalTime horaFim,
        Boolean ativo,
        LocalDateTime dataCadastro) {}