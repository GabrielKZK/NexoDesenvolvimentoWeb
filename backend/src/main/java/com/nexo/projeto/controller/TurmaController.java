package com.nexo.projeto.controller;

import com.nexo.projeto.dto.TurmaDTO;
import com.nexo.projeto.service.TurmaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
@RequiredArgsConstructor
public class TurmaController {
    public final TurmaService service;

    @PostMapping
    public ResponseEntity<TurmaDTO> salvar(@RequestBody TurmaDTO dto){
        TurmaDTO novo = service.salvar(dto);
        if (novo == null)
            return ResponseEntity.unprocessableContent().build();

        return ResponseEntity.ok(novo);
    }

    @GetMapping
    public ResponseEntity<List<TurmaDTO>> listaTodas(){
        List<TurmaDTO> lista = service.listaTodas();

        if (lista.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaDTO> buscaPorId(@PathVariable Long id){
        return service.buscarPorId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(params = "nome")
    public ResponseEntity<List<TurmaDTO>> buscaPorNome(@RequestParam String nome){
        List<TurmaDTO> lista = service.buscaPorNome(nome);

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
    public ResponseEntity<TurmaDTO> alterar(@PathVariable Long id, @RequestBody TurmaDTO dto){
        TurmaDTO mod = service.alterar(id, dto);

        if(mod == null)
            return ResponseEntity.unprocessableContent().build();

        return ResponseEntity.ok(mod);
    }

    @PostMapping("/{turmaId}/materias/{materiaId}")
    public ResponseEntity<TurmaDTO> vincularMateria(@PathVariable Long turmaId, @PathVariable Long materiaId){
        return ResponseEntity.ok(service.vincularMateria(turmaId, materiaId));
    }

    @DeleteMapping("/{turmaId}/materias/{materiaId}")
    public ResponseEntity<TurmaDTO> desvincularMateria(@PathVariable Long turmaId, @PathVariable Long materiaId){
        return ResponseEntity.ok(service.desvincularMateria(turmaId, materiaId));
    }
}
