package com.nexo.projeto.service;

import com.nexo.projeto.dto.TurnoDTO;
import com.nexo.projeto.dto.mapper.TurnoMapper;
import com.nexo.projeto.entity.TurnoEntity;
import com.nexo.projeto.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final TurnoMapper turnoMapper;

    @Transactional(readOnly = true)
    public List<TurnoDTO> listarTodos() {
        return turnoRepository.findAll()
                .stream()
                .map(turnoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public TurnoDTO buscarPorId(Long id) {
        TurnoEntity entity = turnoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Turno não encontrado com id: " + id));
        return turnoMapper.toDTO(entity);
    }

    @Transactional
    public TurnoDTO criar(TurnoDTO dto) {
        if (turnoRepository.existsByNome(dto.nome())) {
            throw new IllegalArgumentException("Já existe um turno cadastrado com este nome");
        }
        TurnoEntity entity = turnoMapper.toEntity(dto);
        entity.setId(null);
        TurnoEntity salvo = turnoRepository.save(entity);
        return turnoMapper.toDTO(salvo);
    }

    @Transactional
    public TurnoDTO atualizar(Long id, TurnoDTO dto) {
        TurnoEntity existente = turnoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Turno não encontrado com id: " + id));

        existente.setNome(dto.nome());
        existente.setHoraInicio(dto.horaInicio());
        existente.setHoraFim(dto.horaFim());
        if (dto.ativo() != null) {
            existente.setAtivo(dto.ativo());
        }

        TurnoEntity atualizado = turnoRepository.save(existente);
        return turnoMapper.toDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!turnoRepository.existsById(id)) {
            throw new IllegalArgumentException("Turno não encontrado com id: " + id);
        }
        turnoRepository.deleteById(id);
    }
}