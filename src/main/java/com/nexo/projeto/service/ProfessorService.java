package com.nexo.projeto.service;

import com.nexo.projeto.dto.ProfessorDto;
import com.nexo.projeto.dto.mapper.ProfessorMapper;
import com.nexo.projeto.entity.ProfessorEntity;
import com.nexo.projeto.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ProfessorMapper professorMapper;

    @Transactional(readOnly = true)
    public List<ProfessorDto> listarTodos() {
        return professorRepository.findAll()
                .stream()
                .map(professorMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProfessorDto buscarPorId(Long id) {
        ProfessorEntity entity = professorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado com id: " + id));
        return professorMapper.toDto(entity);
    }

    @Transactional
    public ProfessorDto criar(ProfessorDto dto) {
        if (professorRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Já existe um professor cadastrado com este e-mail");
        }
        ProfessorEntity entity = professorMapper.toEntity(dto);
        entity.setId(null);
        ProfessorEntity salvo = professorRepository.save(entity);
        return professorMapper.toDto(salvo);
    }

    @Transactional
    public ProfessorDto atualizar(Long id, ProfessorDto dto) {
        ProfessorEntity existente = professorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado com id: " + id));

        existente.setNome(dto.nome());
        existente.setEmail(dto.email());
        existente.setDisciplina(dto.disciplina());
        existente.setTelefone(dto.telefone());
        if (dto.ativo() != null) {
            existente.setAtivo(dto.ativo());
        }
        if (dto.senha() != null && !dto.senha().isBlank()) {
            existente.setSenha(dto.senha());
        }

        ProfessorEntity atualizado = professorRepository.save(existente);
        return professorMapper.toDto(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new IllegalArgumentException("Professor não encontrado com id: " + id);
        }
        professorRepository.deleteById(id);
    }
}