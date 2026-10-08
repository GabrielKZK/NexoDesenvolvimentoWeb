package com.nexo.projeto.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

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

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "alunos")
    private List<Materia> materias = new ArrayList<>();
}
