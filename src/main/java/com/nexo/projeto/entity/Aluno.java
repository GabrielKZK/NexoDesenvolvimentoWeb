package com.nexo.projeto.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "alunos")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String senha;

    private String emailInstitucional;

    private String foto;

    private int xpTotal;

    private int xpSemana;

    private int metaSemanalXp;

    private int ofensivaDias;

    private int tarefasFeitasHoje;

    private int tarefasHoje;
}
