package com.nexo.projeto.controller;

import com.nexo.projeto.dto.TurmaDto;
import com.nexo.projeto.service.TurmaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turma")
@RequiredArgsConstructor
public class TurmaController {
    public final TurmaService service;

    @PostMapping
    public ResponseEntity<TurmaDto> salvar(@RequestBody TurmaDto dto){
        TurmaDto novo = service.salvar(dto);
        if (novo == null)
            return ResponseEntity.unprocessableContent().build();

        return ResponseEntity.ok(novo);
    }

    @GetMapping
    public ResponseEntity<List<TurmaDto>> listaTodas(){
        List<TurmaDto> lista = service.listaTodas();

        if (lista.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaDto> buscaPorId(@PathVariable Long id){
        return service.buscarPorId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{nome}")
    public ResponseEntity<List<TurmaDto>> buscaPorNome(@PathVariable String nome){
        List<TurmaDto> lista = service.buscaPorNome(nome);

        if (lista.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaDto> alterar(@PathVariable Long id, @RequestBody TurmaDto dto){
        TurmaDto mod = service.alterar(id, dto);

        if(mod == null)
            return ResponseEntity.unprocessableContent().build();

        return ResponseEntity.ok(mod);
    }

    @PostMapping("/{turmaId}/materias/{materiaId}")
    public ResponseEntity<TurmaDto> vincularMateria(@PathVariable Long turmaId, @PathVariable Long materiaId){
        return ResponseEntity.ok(service.vincularMateria(turmaId, materiaId));
    }

    @DeleteMapping("/{turmaId}/materias/{materiaId}")
    public ResponseEntity<TurmaDto> desvincularMateria(@PathVariable Long turmaId, @PathVariable Long materiaId){
        return ResponseEntity.ok(service.desvincularMateria(turmaId, materiaId));
    }
}
