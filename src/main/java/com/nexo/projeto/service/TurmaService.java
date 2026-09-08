package com.nexo.projeto.service;

import com.nexo.projeto.dto.TurmaDto;
import com.nexo.projeto.dto.mapper.TurmaMapper;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.entity.ProfessorEntity;
import com.nexo.projeto.entity.Turma;
import com.nexo.projeto.entity.TurnoEntity;
import com.nexo.projeto.repository.MateriaRepository;
import com.nexo.projeto.repository.ProfessorRepository;
import com.nexo.projeto.repository.TurmaRepository;
import com.nexo.projeto.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TurmaService {
    private final TurmaRepository repository;
    private final TurmaMapper mapper;
    private final ProfessorRepository professorRepository;
    private final MateriaRepository materiaRepository;
    private final TurnoRepository turnoRepository;

    @Transactional
    public TurmaDto salvar(TurmaDto dto) {

        Turma turma = mapper.toEntity(dto);
        aplicarProfessor(turma, dto.idProfessor());
        aplicarTurno(turma, dto.idTurno());

        return mapper.toDto(repository.save(turma));
    }

    public List<TurmaDto> listaTodas() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    public Optional<TurmaDto> buscarPorId(Long id) {

        Optional<Turma> turma = repository.findById(id);

        if (turma.isEmpty())
            return Optional.empty();

        return Optional.of(mapper.toDto(turma.get()));
    }

    public List<TurmaDto> buscaPorNome(String nome){
        return repository.findAllByNomeLike(nome).stream()
                .map(mapper::toDto)
                .toList();
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public TurmaDto alterar(Long id, TurmaDto dto){
        Optional<Turma> turma = repository.findById(id);

        if (turma.isEmpty())
            return null;

        Turma novo = mapper.toEntity(dto);
        novo.setId(id);
        aplicarProfessor(novo, dto.idProfessor());
        aplicarTurno(novo, dto.idTurno());

        return mapper.toDto(repository.save(novo));
    }

    private void aplicarProfessor(Turma turma, Long idProfessor) {
        if (idProfessor == null) {
            turma.setProfessor(null);
            return;
        }

        ProfessorEntity professor = professorRepository.findById(idProfessor)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado com id: " + idProfessor));
        turma.setProfessor(professor);
    }

    private void aplicarTurno(Turma turma, Long idTurno) {
        if (idTurno == null) {
            turma.setTurno(null);
            return;
        }

        TurnoEntity turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new IllegalArgumentException("Turno não encontrado com id: " + idTurno));
        turma.setTurno(turno);
    }

    @Transactional
    public TurmaDto vincularMateria(Long turmaId, Long materiaId) {
        Turma turma = repository.findById(turmaId)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com id: " + turmaId));
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada com id: " + materiaId));

        if (!materia.getTurmas().contains(turma)) {
            materia.getTurmas().add(turma);
            materiaRepository.save(materia);
        }

        return mapper.toDto(turma);
    }

    @Transactional
    public TurmaDto desvincularMateria(Long turmaId, Long materiaId) {
        Turma turma = repository.findById(turmaId)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com id: " + turmaId));
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada com id: " + materiaId));

        materia.getTurmas().remove(turma);
        materiaRepository.save(materia);

        return mapper.toDto(turma);
    }

}

