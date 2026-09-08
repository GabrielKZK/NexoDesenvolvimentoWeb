package com.nexo.projeto.dto.mapper;

import com.nexo.projeto.dto.AlunoCadastroDTO;
import com.nexo.projeto.dto.AlunoDTO;
import com.nexo.projeto.entity.Aluno;
import com.nexo.projeto.entity.Materia;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {

    public AlunoDTO toDTO(Aluno aluno) {
        if (aluno == null) {
            return null;
        }

        Long turmaId = null;
        String turmaNome = null;
        if (aluno.getTurma() != null) {
            turmaId = aluno.getTurma().getId();
            turmaNome = aluno.getTurma().getNome();
        }

        return new AlunoDTO(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmailInstitucional(),
                aluno.getFoto(),
                aluno.getXpTotal(),
                aluno.getXpSemana(),
                aluno.getMetaSemanalXp(),
                aluno.getOfensivaDias(),
                aluno.getTarefasFeitasHoje(),
                aluno.getTarefasHoje(),
                turmaId,
                turmaNome,
                aluno.getMaterias().stream().map(Materia::getId).toList()
        );
    }

    public Aluno toEntity(AlunoDTO dto) {
        if (dto == null) {
            return null;
        }
        Aluno aluno = new Aluno();
        aluno.setId(dto.id());
        aluno.setNome(dto.nome());
        aluno.setEmailInstitucional(dto.emailInstitucional());
        aluno.setFoto(dto.foto());
        aluno.setXpTotal(dto.xpTotal());
        aluno.setXpSemana(dto.xpSemana());
        aluno.setMetaSemanalXp(dto.metaSemanalXp());
        aluno.setOfensivaDias(dto.ofensivaDias());
        aluno.setTarefasFeitasHoje(dto.tarefasFeitasHoje());
        aluno.setTarefasHoje(dto.tarefasHoje());
        return aluno;
    }

    public Aluno toEntity(AlunoCadastroDTO dto) {
        if (dto == null) {
            return null;
        }
        Aluno aluno = new Aluno();
        aluno.setNome(dto.nome());
        aluno.setEmailInstitucional(dto.emailInstitucional());
        aluno.setSenha(dto.senha());
        aluno.setFoto(dto.foto());
        return aluno;
    }
}
