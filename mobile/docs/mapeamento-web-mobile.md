# Mapeamento Web → Mobile (Nexo)

Referência: repositório `nexonucleo5/nexo-angular` (branch `master`, commit `0e40666`) — pasta `nexo/` (Angular 21) + `backend/` (Spring Boot, pacote `com.nexo`).

## 1. Diagnóstico inicial: o app mobile falava com outro backend (resolvido)

| | Web (`nexo-angular`) | Mobile atual |
|---|---|---|
| Backend | `com.nexo.*`, JWT + refresh, 4 papéis | `com.nexo.projeto.*` (pasta `/backend` antiga, já removida), sem token |
| Login | `POST /api/auth/login` `{login, senha}` → `{token, usuario}` | professor: `POST /api/professores/login`; aluno: `POST /api/alunos/login` (e-mail institucional) |
| Sessão | access token em memória (15 min) + refresh em cookie HttpOnly (7 dias) | professor: e-mail+senha guardados no SecureStore e reenviados a cada abertura; aluno: só memória |
| Papéis | `ALUNO`, `PROFESSOR`, `DIRETOR`, `ADMIN` | `professor`, `aluno` |
| Domínio | turmas (somente leitura), matérias, conteúdos, desafios/quiz, notas, frequência, avaliações, chat… | CRUD de turmas, matérias e turnos (não existem no web) |

Consequência (já aplicada): `services/` e `types/` foram reescritos sobre o contrato do web; o código e o `/backend` antigos (API `com.nexo.projeto`) foram removidos do repositório.

## 2. Autenticação e sessão (regras a replicar)

1. `POST /api/auth/login` → `{ token, usuario: { id, nome, cargo, foto, role, precisaTrocarSenha } }`. `role` vem em maiúsculo; o web converte para minúsculo.
2. Header `Authorization: Bearer <token>` em toda chamada, exceto `/auth/login` e `/auth/refresh`.
3. Em `401` (e havendo sessão): **uma única** renovação em andamento (`POST /api/auth/refresh`); chamadas concorrentes esperam a mesma promessa. Reapresentar um refresh token antigo faz o servidor **revogar todas as sessões** — por isso a serialização é obrigatória, não otimização.
4. Falhou o refresh → `logout` local + volta ao login.
5. `precisaTrocarSenha === true` → única tela liberada é *Trocar senha* (equivalente ao `authGuard`). Depois do login normal, destino é o painel.
6. Logout: `POST /api/auth/logout` (melhor esforço) + limpar estado local.
7. Guards por papel (`roleGuard`) são só UX; o backend reforça em cada endpoint.
8. Erro padrão da API: `{ timestamp, status, error, message, fields? }`; `status 0` = sem conexão. Listagens paginadas: `{ content, page, size, totalElements, totalPages }`.
9. Fotos: valor `/api/fotos/{id}` é relativo à API (endpoint público); sem foto → avatar padrão.
10. Política de senha: mínimo 8 (máx. 50 no cliente); checagem prévia em `POST /api/usuarios/me/senha/validar`.

> **Decidido (nov/2026):** o projeto web **não será alterado**. A Opção A (mudar o backend) foi substituída por uma variação sem mudança no servidor: o app lê o cookie `nexo_refresh` do cabeçalho `Set-Cookie`, guarda no `expo-secure-store` e o reenvia no cabeçalho `Cookie` em `/auth/refresh` e `/auth/logout` (ver `src/services/session.ts` e `authService.ts`). **Ainda não validado em aparelho** — confirmar que iOS e Android expõem `Set-Cookie` ao JS.

### Contexto original — refresh token em cookie
O refresh token só existe em cookie `nexo_refresh` (`HttpOnly; SameSite=Strict; Path=/api/auth`) e é lido via `@CookieValue`; o corpo do login **não** o devolve. No React Native o cookie jar nativo (iOS/Android) costuma reenviar o cookie ao mesmo host, mas é opaco (não dá para checar existência, apagar de forma confiável nem tratar `Secure` em HTTP de desenvolvimento). Opções:
- **A (recomendada):** ajustar o backend do web para, num cabeçalho opt-in de cliente mobile (ex.: `X-Client: mobile`), devolver o refresh token no corpo e aceitá-lo no corpo de `/refresh` e `/logout`; no app, guardar em `expo-secure-store`. Exige mudança no repo do web.
- **B:** manter o cookie e confiar no cookie jar nativo (sem mudança no backend; frágil e difícil de testar).

### WebSocket do chat
`GET /api/chat/ws-ticket` → `{ticket}` (uso único, 30 s) → `ws(s)://<host>/ws/chat?ticket=<ticket>`; envio `{para, texto}`; mensagens recebidas em JSON; reconexão a cada 3 s pedindo ticket novo; derrubar o socket ao trocar de conta. O `WebSocket` do RN serve. **Implementado** em `src/services/chatSocket.ts`. Sobre `setAllowedOrigins`: o Spring aceita o handshake sem cabeçalho `Origin` (o React Native costuma não enviá-lo); se algum aparelho enviar `Origin`, a liberação seria no backend.

### Configuração de ambiente
`apiUrl` e `wsUrl` hoje derivam do host do Metro (`services/config.ts`, porta 8080, sem `/api`). Passar a usar `…:8080/api` e `ws://…:8080/ws`; produção via variável (`expo-constants`/`app.json extra`).

## 3. Telas: web → mobile (status final)

Legenda: ✅ migrada · ➖ fora do escopo / não existe no web · ⚠️ migrada parcialmente.

### Compartilhadas
| Web (rota) | Endpoints | Mobile | Status |
|---|---|---|---|
| `/login` | `POST /auth/login` | `Login` (campo único `login`; sem papel/auto-cadastro) | ✅ |
| `/trocar-senha` | `POST /usuarios/me/senha/validar`, `POST /usuarios/me/senha` | `TrocarSenha` (bloqueante no 1º acesso; voluntária pelo Perfil; envia o cookie de refresh para não derrubar a própria sessão) | ✅ |
| `/dashboards` | por papel | primeira aba de cada papel | ✅ |
| `/perfil` | `GET/PATCH /usuarios/me`, `POST/DELETE /usuarios/me/foto` | `Perfil` (foto: `expo-image-picker` + `expo-image-manipulator` → JPEG ≤ 2 MB) | ✅ |
| `/configuracoes` | `GET /configuracoes`, `PATCH /configuracoes/{secao}` | `Configuracoes` (aluno: gamificação e privacidade) | ⚠️ outras seções e papéis não migrados |
| `/mensagens` (chat) | `/chat/contatos`, `/chat/{id}`, `/chat/ws-ticket`, WS `/ws/chat` | `Chat` + `Conversa` (ícone no cabeçalho, contador de não lidas) | ✅ (aluno, professor, diretor) |
| `/sobre`, `/suporte` | estático | — | ➖ não migradas |

### Aluno — abas Início · Matérias · Desafios · Notas · Perfil
| Web | Endpoints | Mobile | Status |
|---|---|---|---|
| dashboard | `GET /aluno/dashboard` | `AlunoDashboard` (ranking some com `rankingTurma` desligado ou `foraDoRanking`) | ✅ |
| `/materias`, `/disciplina/:id` | `/aluno/materias`, `/materias/{id}/conteudos`, `PUT/DELETE /aluno/conteudos/{id}/concluido` | `AlunoMaterias`, `AlunoMateriaDetalhe` | ✅ |
| `/desafios`, `/desafios/:id/quiz` | `/aluno/desafios…`, `POST …/quiz/finalizar` | `Desafios`, `Quiz` (só 100% conclui e dá XP) | ✅ |
| `/meus-niveis-notas` | `GET /aluno/notas` | `Notas` | ✅ |

### Professor — abas Início · Diário · Notas · Avaliações · Comunicação (+ perfil no cabeçalho)
| Web | Endpoints | Mobile | Status |
|---|---|---|---|
| `/professor-dashboard` | `/professor/dashboard`, `/professor/materias` | `ProfessorDashboard` | ✅ |
| `/diario-classe-professor` | `/turmas`, `/turmas/{id}/frequencia`, `/turmas/{id}/conteudos` | `Diario` | ✅ |
| `/notas-engajamento` | `/turmas/{id}/notas`, `PATCH /alunos/{id}/notas`, `/alunos/{id}/observacoes` | `ProfessorNotas` (+ observações em Comunicação → Alunos) | ✅ |
| `/avaliacao` | `/avaliacoes`, `/avaliacoes/fila-correcao`, `/questoes` | `ProfessorAvaliacoes` (data como texto `AAAA-MM-DD`) | ✅ |
| `/comunicacao` | `/mensagens`, `/avisos`, `/duvidas` | `Comunicacao` | ✅ |

### Diretor — abas Início · Evasão · Relatórios · Docentes · Mais (+ chat e perfil no cabeçalho)
| Web | Endpoints | Mobile | Status |
|---|---|---|---|
| `/diretor-dashboards` | `/relatorios/desempenho`, `/evasao/risco`, `/monitoramento/professores` | `DiretorDashboard` (KPIs e alertas calculados como no web) | ✅ |
| `/evasao` | `GET /evasao/risco` | `Evasao` (filtros risco/turma/busca; detalhe expansível) | ✅ |
| `/relatorios` | `/relatorios/desempenho`, `/periodos`, `/desempenho/export` | `Relatorios` (exporta PDF/Excel: `expo-file-system` + `expo-sharing`) | ✅ |
| `/monitoramento` | `GET /monitoramento/professores` | `Monitoramento` (aba Docentes; "Conversar" abre o chat via `usuarioId`) | ✅ |
| `/inscricoes` | `/inscricoes` (paginado), `PATCH /{id}/ativo`, `PATCH /{id}/turma` | `Inscricoes` (Mais) | ✅ |
| `/cadastro` | `POST /alunos`, `POST /professores` | `Cadastro` (Mais; senha provisória exibida uma vez + copiar) | ✅ |
| `/mensagens` | chat | `Chat` | ✅ |

### Administrador — abas Início · Contas · Catálogo · Mais (+ perfil no cabeçalho; sem chat)
| Web | Endpoints | Mobile | Status |
|---|---|---|---|
| `/admin-dashboard` | `GET /admin/dashboard` | `AdminDashboard` | ✅ |
| `/contas` | `/admin/contas`, `PATCH …/ativo`, `POST …/senha-provisoria` | `Contas` | ✅ |
| `/catalogo` | `/admin/catalogo…` (publicar, reordenar, desafios) | `Catalogo` + `CatalogoMateria` | ✅ |
| `/inscricoes`, `/cadastro` | ver Diretor (admin cadastra só aluno: `POST /professores` é do DIRETOR) | `Inscricoes`, `Cadastro` | ✅ |
| `/auditoria` (+ logs) | `/auditoria/eventos`, `/auditoria/sistema/logs`, `/auditoria/sistema/resumo` (**só ADMIN**) | `Auditoria` (Resumo · Eventos · Logs) | ✅ |

> Os menus do **diretor** seguem exatamente os do web (sem Contas/Catálogo; decisão do projeto).

## 4. Navegação implementada

React Navigation (native-stack + bottom-tabs), conforme `AGENTS.md`.

- `RootNavigator` decide pelo estado: carregando → *Loading*; sem usuário → `Login`; `precisaTrocarSenha` → só `TrocarSenha`; senão `Tabs` + telas de detalhe (`MateriaDetalhe`, `Quiz`, `Chat`, `Conversa`, `Inscricoes`, `Cadastro`, `CatalogoMateria`, `Auditoria` [só admin], `PerfilStack`, `Configuracoes`, `TrocarSenha`). Como só existem as rotas do estado atual, não há como "fugir" da troca de senha.
- `TabsNavigator` monta as abas pelo papel (5/5/5/4). Só o aluno tem aba *Perfil*; os demais abrem o perfil pelo ícone do cabeçalho. O ícone de chat (com contador) aparece para aluno, professor e diretor.
- Responsividade: áreas seguras (`useSafeAreaInsets`), `KeyboardAvoidingView` nos formulários e no chat, alvos de toque ≥ 44 pt, listas com `FlatList`/pull-to-refresh/paginação, tema claro/escuro.

## 5. O que foi feito, em ordem

1. Fundação: `api.ts` (Bearer, 401 → refresh serializado), tipos do web, `AuthContext`, cookie de refresh no SecureStore.
2. Login + Trocar senha + Perfil (foto) + navegação por papel.
3. Aluno completo (+ preferência "ranking da turma" via `/api/configuracoes`).
4. Professor completo.
5. Chat por WebSocket com ticket (aluno, professor, diretor).
6. Diretor e Admin.

Dependências nativas adicionadas ao longo do caminho (todas via `npx expo install`): `expo-secure-store`, `expo-image-picker`, `expo-image-manipulator`, `expo-file-system`, `expo-sharing`, `expo-clipboard`; `@react-navigation/elements` declarado explicitamente.

## 6. Pontos de atenção / pendências

- **Sem teste em aparelho**: tudo passa no `tsc`, mas o app não foi executado contra o backend. Prioridades de teste: (1) captura do `Set-Cookie` no login e refresh depois de 15 min; (2) upload de foto; (3) exportação PDF/Excel e folha de compartilhamento; (4) chat em dois aparelhos.
- Possível falha no web (não verificada, não reportada): `POST /usuarios/me/senha` depende do cookie `nexo_refresh` com `Path=/api/auth`, que o navegador não envia em `/api/usuarios/…`; no app o cookie é enviado manualmente.
- Senhas provisórias (cadastro e `senha-provisoria`) aparecem uma única vez na resposta; a UI avisa e não as guarda.
- Dados sensíveis (notas, mensagens) não são persistidos em disco; só refresh token e perfil mínimo no SecureStore.
- Não migrado: Sobre/Suporte; configurações além de gamificação/privacidade do aluno; sincronizar o tema com `aparencia.temaEscuro`.
