package com.nexo.projeto.controller;

import com.nexo.projeto.dto.TurnoDto;
import com.nexo.projeto.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<TurnoDto>> listarTodos() {
        return ResponseEntity.ok(turnoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurnoDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turnoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TurnoDto> criar(@RequestBody TurnoDto dto) {
        TurnoDto criado = turnoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurnoDto> atualizar(@PathVariable Long id, @RequestBody TurnoDto dto) {
        return ResponseEntity.ok(turnoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        turnoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}