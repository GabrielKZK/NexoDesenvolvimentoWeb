package com.nexo.projeto.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Turma {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Integer anoLetivo;

    private String turno;

    @ManyToOne
    @JoinColumn(name = "id")
    private String professor; //TEMPORARIAMENTE STRING ATE PROFESSOR PRONTO
    
}
