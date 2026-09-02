package com.nexo.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlteracaoSenhaDTO(

        @NotBlank(message = "A senha atual e obrigatoria")
        String senhaAtual,

        @NotBlank(message = "A nova senha e obrigatoria")
        @Size(min = 8, max = 64, message = "A senha deve ter entre 8 e 64 caracteres")
        String novaSenha
) {
}
