package com.nexo.projeto.service;

import com.nexo.projeto.dto.AlunoCadastroDTO;
import com.nexo.projeto.dto.AlunoDTO;
import com.nexo.projeto.dto.mapper.AlunoMapper;
import com.nexo.projeto.entity.Aluno;
import com.nexo.projeto.entity.Materia;
import com.nexo.projeto.entity.Turma;
import com.nexo.projeto.repository.AlunoRepository;
import com.nexo.projeto.repository.MateriaRepository;
import com.nexo.projeto.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlunoService {

    private static final int XP_POR_TAREFA = 10;
    private static final int BONUS_DIA_COMPLETO = 25;
    private static final int META_SEMANAL_PADRAO = 100;
    private static final int LIMITE_TAREFAS_POR_DIA = 20;

    private final AlunoRepository repository;
    private final AlunoMapper mapper;
    private final TurmaRepository turmaRepository;
    private final MateriaRepository materiaRepository;


    @Transactional
    public ResponseEntity<AlunoDTO> cadastrar(AlunoCadastroDTO dto) {
        String email = normalizarEmail(dto.emailInstitucional());

        if (repository.existsByEmailInstitucional(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Aluno aluno = mapper.toEntity(dto);
        aluno.setNome(dto.nome().trim());
        aluno.setEmailInstitucional(email);
        aluno.setSenha(dto.senha());
        aluno.setMetaSemanalXp(META_SEMANAL_PADRAO);

        if (dto.turmaId() != null) {
            Turma turma = turmaRepository.findById(dto.turmaId())
                    .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com id: " + dto.turmaId()));
            aluno.setTurma(turma);
        }

        AlunoDTO salvo = mapper.toDTO(repository.save(aluno));
        return ResponseEntity.created(URI.create("/api/alunos/" + salvo.id())).body(salvo);
    }

    @Transactional
    public ResponseEntity<AlunoDTO> atualizarPerfil(Long id, AlunoDTO dto) {
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String email = normalizarEmail(dto.emailInstitucional());
        if (repository.existsByEmailInstitucionalAndIdNot(email, id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Aluno aluno = encontrado.get();
        aluno.setNome(dto.nome().trim());
        aluno.setEmailInstitucional(email);
        aluno.setFoto(dto.foto());

        if (dto.turmaId() != null) {
            Turma turma = turmaRepository.findById(dto.turmaId())
                    .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com id: " + dto.turmaId()));
            aluno.setTurma(turma);
        }

        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @Transactional
    public ResponseEntity<AlunoDTO> matricularEmMateria(Long id, Long materiaId) {
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada com id: " + materiaId));

        Aluno aluno = encontrado.get();
        if (!materia.getAlunos().contains(aluno)) {
            materia.getAlunos().add(aluno);
            materiaRepository.save(materia);
        }

        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @Transactional
    public ResponseEntity<AlunoDTO> removerDeMateria(Long id, Long materiaId) {
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada com id: " + materiaId));

        Aluno aluno = encontrado.get();
        materia.getAlunos().remove(aluno);
        materiaRepository.save(materia);

        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @Transactional
    public ResponseEntity<Void> alterarSenha(Long id, String senhaAtual, String novaSenha) {
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Aluno aluno = encontrado.get();
        if (!aluno.getSenha().equals(senhaAtual)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (aluno.getSenha().equals(novaSenha)) {
            return ResponseEntity.badRequest().build();
        }

        aluno.setSenha(novaSenha);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<AlunoDTO> autenticar(String emailInstitucional, String senha) {
        Optional<Aluno> encontrado = repository.findByEmailInstitucional(normalizarEmail(emailInstitucional));

        if (encontrado.isEmpty() || !encontrado.get().getSenha().equals(senha)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(mapper.toDTO(encontrado.get()));
    }

    @Transactional
    public ResponseEntity<Void> deletar(Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    public ResponseEntity<AlunoDTO> buscarPorId(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<AlunoDTO> buscarPorEmail(String email) {
        return repository.findByEmailInstitucional(normalizarEmail(email))
                .map(mapper::toDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Page<AlunoDTO>> listar(Pageable pageable) {
        return ResponseEntity.ok(repository.findAll(pageable).map(mapper::toDTO));
    }

    public ResponseEntity<List<AlunoDTO>> buscarPorNome(String nome) {
        return ResponseEntity.ok(repository.findByNomeContainingIgnoreCaseOrderByNomeAsc(nome).stream()
                .map(mapper::toDTO)
                .toList());
    }


    @Transactional
    public ResponseEntity<AlunoDTO> definirTarefasDoDia(Long id, int quantidade) {
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Aluno aluno = encontrado.get();
        if (quantidade < 0 || quantidade > LIMITE_TAREFAS_POR_DIA) {
            return ResponseEntity.badRequest().build();
        }
        if (quantidade < aluno.getTarefasFeitasHoje()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        aluno.setTarefasHoje(quantidade);
        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @Transactional
    public ResponseEntity<AlunoDTO> concluirTarefa(Long id) {
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Aluno aluno = encontrado.get();
        if (aluno.getTarefasHoje() <= 0 || aluno.getTarefasFeitasHoje() >= aluno.getTarefasHoje()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        boolean fechouODia = aluno.getTarefasFeitasHoje() + 1 == aluno.getTarefasHoje();
        int xp = fechouODia ? XP_POR_TAREFA + BONUS_DIA_COMPLETO : XP_POR_TAREFA;

        repository.registrarTarefaConcluida(id);
        repository.adicionarXp(id, xp);

        return buscarPorId(id);
    }

    @Transactional
    public ResponseEntity<AlunoDTO> adicionarXp(Long id, int xp) {
        if (xp <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (repository.adicionarXp(id, xp) == 0) {
            return ResponseEntity.notFound().build();
        }
        return buscarPorId(id);
    }

    @Transactional
    public ResponseEntity<AlunoDTO> definirMetaSemanal(Long id, int meta) {
        if (meta <= 0) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Aluno> encontrado = repository.findById(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Aluno aluno = encontrado.get();
        aluno.setMetaSemanalXp(meta);
        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    public ResponseEntity<Integer> progressoDaMetaSemanal(Long id) {
        return repository.findById(id)
                .map(aluno -> aluno.getMetaSemanalXp() <= 0
                        ? 0
                        : Math.min(100, (aluno.getXpSemana() * 100) / aluno.getMetaSemanalXp()))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<Boolean> bateuMetaSemanal(Long id) {
        return repository.findById(id)
                .map(aluno -> aluno.getMetaSemanalXp() > 0 && aluno.getXpSemana() >= aluno.getMetaSemanalXp())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    public ResponseEntity<Page<AlunoDTO>> ranking(Pageable pageable) {
        return ResponseEntity.ok(repository.findAllByOrderByXpTotalDescNomeAsc(pageable).map(mapper::toDTO));
    }

    public ResponseEntity<List<AlunoDTO>> top10Geral() {
        return ResponseEntity.ok(repository.findTop10ByOrderByXpTotalDesc().stream().map(mapper::toDTO).toList());
    }

    public ResponseEntity<List<AlunoDTO>> top10DaSemana() {
        return ResponseEntity.ok(repository.findTop10ByOrderByXpSemanaDesc().stream().map(mapper::toDTO).toList());
    }

    public ResponseEntity<List<AlunoDTO>> top10Ofensiva() {
        return ResponseEntity.ok(repository.findTop10ByOrderByOfensivaDiasDesc().stream().map(mapper::toDTO).toList());
    }

    public ResponseEntity<Long> posicaoNoRanking(Long id) {
        return repository.findById(id)
                .map(aluno -> repository.calcularPosicaoNoRanking(aluno.getXpTotal()))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<AlunoDTO>> listarQuemBateuMetaSemanal() {
        return ResponseEntity.ok(repository.buscarQuemBateuMetaSemanal().stream().map(mapper::toDTO).toList());
    }

    public ResponseEntity<List<AlunoDTO>> listarQuemNaoBateuMetaSemanal() {
        return ResponseEntity.ok(repository.buscarQuemNaoBateuMetaSemanal().stream().map(mapper::toDTO).toList());
    }


    @Transactional
    public ResponseEntity<Void> virarDia() {
        repository.incrementarOfensivaDeQuemEstudou();
        repository.zerarOfensivaDeQuemFaltou();
        repository.zerarTarefasDoDia();
        return ResponseEntity.noContent().build();
    }

    @Transactional
    public ResponseEntity<Void> virarSemana() {
        repository.zerarXpSemanalDeTodos();
        return ResponseEntity.noContent().build();
    }


    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
