package com.nexo.projeto.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(

        @NotBlank(message = "O email institucional e obrigatorio")
        String emailInstitucional,

        @NotBlank(message = "A senha e obrigatoria")
        String senha
) {
}
