package com.nexo.projeto.service;

import com.nexo.projeto.dto.ProfessorDTO;
import com.nexo.projeto.dto.mapper.ProfessorMapper;
import com.nexo.projeto.entity.ProfessorEntity;
import com.nexo.projeto.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ProfessorMapper professorMapper;

    @Transactional(readOnly = true)
    public List<ProfessorDTO> listarTodos() {
        return professorRepository.findAll()
                .stream()
                .map(professorMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProfessorDTO buscarPorId(Long id) {
        ProfessorEntity entity = professorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado com id: " + id));
        return professorMapper.toDTO(entity);
    }

    @Transactional
    public ProfessorDTO criar(ProfessorDTO dto) {
        if (professorRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Já existe um professor cadastrado com este e-mail");
        }
        ProfessorEntity entity = professorMapper.toEntity(dto);
        entity.setId(null);
        ProfessorEntity salvo = professorRepository.save(entity);
        return professorMapper.toDTO(salvo);
    }

    @Transactional
    public ProfessorDTO atualizar(Long id, ProfessorDTO dto) {
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
        return professorMapper.toDTO(atualizado);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ProfessorDTO> autenticar(String email, String senha) {
        Optional<ProfessorEntity> encontrado = professorRepository.findByEmail(email);

        if (encontrado.isEmpty() || !encontrado.get().getSenha().equals(senha)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (Boolean.FALSE.equals(encontrado.get().getAtivo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(professorMapper.toDTO(encontrado.get()));
    }

    @Transactional
    public void deletar(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new IllegalArgumentException("Professor não encontrado com id: " + id);
        }
        professorRepository.deleteById(id);
    }
}