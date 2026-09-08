package com.nexo.projeto.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.nexo.projeto.dto.MateriaDto;
import com.nexo.projeto.dto.mapper.MaterialMapper;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MateriaService {

    private final MateriaRepository repository;
    private final MaterialMapper mapper;

    public MateriaDto salvar(MateriaDto m) {

        Materia e = mapper.toEntity(m);

        return mapper.toDto(repository.save(e));
    }

    public List<Materia> listarTodas() {
        return repository.findAll();
    }

    public Optional<MateriaDto> buscarPorId(Long id) {
        Optional<Materia> materia = repository.findById(id);

        if (materia.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(mapper.toDto(materia.get()));
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public List<Materia> buscarPorNome(String nome) {
        return repository.findByNomeLike(nome);
    }

    public MateriaDto alterar(Long id, MateriaDto dto) {
        Optional<Materia> materiaExistente = repository.findById(id);

        if (materiaExistente.isEmpty()) {
            return null;
        }

        Materia materiaAtualizada = mapper.toEntity(dto);
        materiaAtualizada.setId(id);

        return mapper.toDto(repository.save(materiaAtualizada));
    }
}
