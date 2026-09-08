package com.nexo.projeto.controller;

import com.nexo.projeto.dto.MateriaDto;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.service.MateriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materias")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService service;

    @PostMapping
    public ResponseEntity<MateriaDto> criar(@RequestBody MateriaDto materia) {
        MateriaDto salva = service.salvar(materia);

        if (salva == null) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @GetMapping
    public ResponseEntity<List<Materia>> listarTodas() {
        List<Materia> materias = service.listarTodas();

        if (materias.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(materias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaDto> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nome")
    public ResponseEntity<List<Materia>> buscarPorNome(
            @RequestParam String nome) {

        List<Materia> materias = service.buscarPorNome(nome);

        if (materias.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(materias);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaDto> alterar(
            @PathVariable Long id,
            @RequestBody MateriaDto dto) {

        MateriaDto mod = service.alterar(id, dto);

        if (mod == null) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).build();
        }

        return ResponseEntity.ok(mod);
    }
}

