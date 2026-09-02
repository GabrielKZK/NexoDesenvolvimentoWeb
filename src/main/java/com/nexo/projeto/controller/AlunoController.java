package com.nexo.projeto.controller;

import com.nexo.projeto.dto.AlteracaoSenhaDTO;
import com.nexo.projeto.dto.AlunoCadastroDTO;
import com.nexo.projeto.dto.AlunoDTO;
import com.nexo.projeto.dto.LoginDTO;
import com.nexo.projeto.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService service;


    @PostMapping("/cadastrar")
    public ResponseEntity<AlunoDTO> cadastro(@Valid @RequestBody AlunoCadastroDTO dto) {
        return service.cadastrar(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<AlunoDTO> login(@Valid @RequestBody LoginDTO dto) {
        return service.autenticar(dto.emailInstitucional(), dto.senha());
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<AlunoDTO> atualizarPerfil(@PathVariable Long id, @RequestBody AlunoDTO dto) {
        return service.atualizarPerfil(id, dto);
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable Long id, @Valid @RequestBody AlteracaoSenhaDTO dto) {
        return service.alterarSenha(id, dto.senhaAtual(), dto.novaSenha());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id);
    }


    @GetMapping
    public ResponseEntity<Page<AlunoDTO>> listar(Pageable pageable) {
        return service.listar(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoDTO> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/busca/email")
    public ResponseEntity<AlunoDTO> buscarPorEmail(@RequestParam String email) {
        return service.buscarPorEmail(email);
    }

    @GetMapping("/busca/nome")
    public ResponseEntity<List<AlunoDTO>> buscarPorNome(@RequestParam String nome) {
        return service.buscarPorNome(nome);
    }


    @PatchMapping("/{id}/tarefas")
    public ResponseEntity<AlunoDTO> definirTarefasDoDia(@PathVariable Long id, @RequestParam int quantidade) {
        return service.definirTarefasDoDia(id, quantidade);
    }

    @PostMapping("/{id}/tarefas/concluir")
    public ResponseEntity<AlunoDTO> concluirTarefa(@PathVariable Long id) {
        return service.concluirTarefa(id);
    }

    @PostMapping("/{id}/xp")
    public ResponseEntity<AlunoDTO> adicionarXp(@PathVariable Long id, @RequestParam int valor) {
        return service.adicionarXp(id, valor);
    }

    @PatchMapping("/{id}/meta")
    public ResponseEntity<AlunoDTO> definirMetaSemanal(@PathVariable Long id, @RequestParam int xp) {
        return service.definirMetaSemanal(id, xp);
    }

    @GetMapping("/{id}/progresso")
    public ResponseEntity<Integer> progressoDaMetaSemanal(@PathVariable Long id) {
        return service.progressoDaMetaSemanal(id);
    }

    @GetMapping("/{id}/meta-batida")
    public ResponseEntity<Boolean> bateuMetaSemanal(@PathVariable Long id) {
        return service.bateuMetaSemanal(id);
    }


    @GetMapping("/ranking")
    public ResponseEntity<Page<AlunoDTO>> ranking(Pageable pageable) {
        return service.ranking(pageable);
    }

    @GetMapping("/ranking/top10")
    public ResponseEntity<List<AlunoDTO>> top10Geral() {
        return service.top10Geral();
    }

    @GetMapping("/ranking/top10/semana")
    public ResponseEntity<List<AlunoDTO>> top10DaSemana() {
        return service.top10DaSemana();
    }

    @GetMapping("/ranking/top10/ofensiva")
    public ResponseEntity<List<AlunoDTO>> top10Ofensiva() {
        return service.top10Ofensiva();
    }

    @GetMapping("/{id}/posicao")
    public ResponseEntity<Long> posicaoNoRanking(@PathVariable Long id) {
        return service.posicaoNoRanking(id);
    }

    @GetMapping("/meta/batida")
    public ResponseEntity<List<AlunoDTO>> listarQuemBateuMetaSemanal() {
        return service.listarQuemBateuMetaSemanal();
    }

    @GetMapping("/meta/nao-batida")
    public ResponseEntity<List<AlunoDTO>> listarQuemNaoBateuMetaSemanal() {
        return service.listarQuemNaoBateuMetaSemanal();
    }


    @PostMapping("/virada/dia")
    public ResponseEntity<Void> virarDia() {
        return service.virarDia();
    }

    @PostMapping("/virada/semana")
    public ResponseEntity<Void> virarSemana() {
        return service.virarSemana();
    }
}
