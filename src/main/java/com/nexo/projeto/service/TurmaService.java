package com.nexo.projeto.service;

import com.nexo.projeto.dto.TurmaDto;
import com.nexo.projeto.dto.mapper.TurmaMapper;
import com.nexo.projeto.entity.Turma;
import com.nexo.projeto.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TurmaService {
    private final TurmaRepository repository;
    private final TurmaMapper mapper;

    public TurmaDto salvar(TurmaDto dto) {

        Turma turma = mapper.toEntity(dto);

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

    public TurmaDto alterar(Long id, TurmaDto dto){
        Optional<Turma> turma = repository.findById(id);

        if (turma.isEmpty())
            return null;

        Turma novo = mapper.toEntity(dto);
        novo.setId(id);

        return mapper.toDto(repository.save(novo));
    }

}

