package com.nexo.projeto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlunoCadastroDTO(

        @NotBlank(message = "O nome e obrigatorio")
        @Size(max = 100, message = "O nome deve ter no maximo 100 caracteres")
        String nome,

        @NotBlank(message = "O email institucional e obrigatorio")
        @Email(message = "Email invalido")
        @Size(max = 150, message = "O email deve ter no maximo 150 caracteres")
        String emailInstitucional,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 8, max = 64, message = "A senha deve ter entre 8 e 64 caracteres")
        String senha,

        @Size(max = 255, message = "A URL da foto deve ter no maximo 255 caracteres")
        String foto
) {
}
