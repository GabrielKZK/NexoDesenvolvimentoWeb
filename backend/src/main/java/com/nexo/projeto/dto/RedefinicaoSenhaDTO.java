package com.nexo.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RedefinicaoSenhaDTO(

        @NotBlank(message = "O email institucional e obrigatorio")
        String emailInstitucional,

        @NotBlank(message = "A nova senha e obrigatoria")
        @Size(min = 8, max = 64, message = "A senha deve ter entre 8 e 64 caracteres")
        String novaSenha
) {
}
