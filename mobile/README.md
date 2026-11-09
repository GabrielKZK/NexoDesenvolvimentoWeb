# Nexo — App Mobile

App **React Native (Expo SDK 57 + TypeScript)** que é a versão mobile da plataforma web Nexo (repositório `nexonucleo5/nexo-angular`). Consome o **mesmo backend** do web (Spring Boot, pacote `com.nexo`, API em `/api`, WebSocket em `/ws`), com as mesmas regras de negócio, autenticação e endpoints. O projeto web não é alterado por este app.

Um único app atende os quatro papéis do sistema — **aluno, professor, diretor e administrador**. O papel vem da conta (não há escolha de perfil no login, nem auto-cadastro: contas são criadas por diretor/admin).

## Funcionalidades

### Todos os papéis
- **Login** (`login` + senha) com o mesmo seletor claro/escuro do login do web; sessão restaurada ao abrir o app, renovação automática do token.
- **Troca de senha obrigatória** no primeiro acesso (única tela liberada até concluir) e voluntária pelo Perfil, com validação de política no servidor.
- **Perfil**: nome, foto (câmera/galeria, reenquadrada e enviada como JPEG), tema claro/escuro, sair.
- **Chat em tempo real** (aluno, professor, diretor) por WebSocket: contatos, histórico, contador de não lidas, reconexão automática. O admin não tem chat (regra do backend).

### Aluno (abas: Início · Matérias · Desafios · Notas · Perfil)
Dashboard com XP, ofensiva, meta semanal e ranking da turma (some se a preferência estiver desligada) · matérias com progresso e marcação de conteúdo concluído · desafios e quiz (só 100% conclui e dá XP) · notas · Configurações (gamificação e privacidade, via `/api/configuracoes`).

### Professor (abas: Início · Diário · Notas · Avaliações · Comunicação)
Dashboard · diário de classe (chamada e conteúdo ministrado) · notas P1/P2/T1/participação · avaliações, fila de correção e banco de questões · mensagens, dúvidas, avisos e observações pedagógicas por aluno.

### Diretor (abas: Início · Evasão · Relatórios · Docentes · Mais)
Painel com KPIs e alertas · risco de evasão com filtros · relatório de desempenho por período, **exportável em PDF/Excel** (arquivo baixado e compartilhado pela folha do sistema) · monitoramento docente com atalho para conversar · *Mais*: inscrições (ativar/desativar, transferir de turma) e cadastro de aluno/professor (senha provisória exibida uma única vez, com botão de copiar).

### Administrador (abas: Início · Contas · Catálogo · Mais)
Painel de contas e catálogo · contas (busca, filtro por papel, ativar/desativar, senha provisória) · catálogo (publicar/despublicar conteúdos e desafios, reordenar conteúdos) · *Mais*: inscrições, cadastro de aluno e **auditoria e logs** (resumo de saúde, eventos, log da aplicação — só admin, como no backend).

> Ver o mapeamento completo tela a tela em [`docs/mapeamento-web-mobile.md`](docs/mapeamento-web-mobile.md).

## Como rodar

```bash
cd mobile
npm install
npx expo start
```

Abra no Expo Go (celular físico) ou em emulador Android/iOS pelo QR Code/menu do Metro. O Expo Go serve para tudo, inclusive câmera/galeria, compartilhamento e chat.

Verificações: `npx tsc --noEmit` (tipos). Não há configuração de lint no projeto ainda.

## Endereço da API

O backend do web roda por padrão em `http://localhost:8080`. [`src/services/config.ts`](src/services/config.ts) resolve o host (ordem):

1. `expo.extra.apiBaseUrl` no `app.json` (produção, ex.: `"https://nexo.exemplo.com"`);
2. `LAN_IP_OVERRIDE`, se preenchido;
3. IP do computador que serve o Metro (celular físico);
4. `10.0.2.2` no emulador Android, `localhost` no iOS Simulator.

Dele saem `API_URL` (`…/api`) e `WS_URL` (`ws(s)://…/ws`). Em produção use **HTTPS/WSS**. Suba o backend do web (próxima seção) antes de testar; o celular e o computador precisam estar na mesma rede. Se o backend usar outra porta, mude `API_PORT` em `src/services/config.ts` (ou defina `expo.extra.apiBaseUrl`) — o backend não precisa de alteração.

## Backend do web (obrigatório para testar)

O app **não tem backend próprio**: usa o do projeto web, que fica no repositório `nexonucleo5/nexo-angular` (pasta `backend/`, Spring Boot). O `backend/` que existia *neste* repositório era a API antiga e foi removido.

```bash
git clone https://github.com/nexonucleo5/nexo-angular.git
cd nexo-angular/backend
# JDK 17 ou superior; o segredo do JWT é obrigatório (qualquer texto longo serve em desenvolvimento)
set NEXO_JWT_SECRET=um-segredo-longo-de-desenvolvimento-0123456789   # Windows (cmd)
# export NEXO_JWT_SECRET=...                                           # Linux/macOS
./mvnw spring-boot:run
```

- Sobe em `http://localhost:8080` com banco H2 local (arquivo `data/`), sem Postgres nem Docker.
- Com o banco vazio, o seed cria quatro usuários, todos com a senha `123456`: `aluno`, `professor`, `diretor` e `admin`.
- Em banco que já tem dados valem os logins e senhas desse banco; o seed só roda em banco vazio.

## Autenticação (resumo)

- Access token JWT (15 min) **só em memória**; refresh token (7 dias) e perfil mínimo no `expo-secure-store`.
- O backend entrega o refresh em cookie HttpOnly. Como o web não é alterado, o app lê o `nexo_refresh` do `Set-Cookie` do login/refresh e o reenvia manualmente no cabeçalho `Cookie` (`src/services/session.ts`, `authService.ts`).
- Em `401`, **uma única** renovação compartilhada e a chamada é repetida; se o servidor recusar, a sessão é limpa e o app volta ao login. Falta de rede mantém a sessão em cache.
- ⚠️ **A captura do `Set-Cookie` ainda não foi validada em aparelho real.** Se o iOS/Android não expuserem o cabeçalho ao JavaScript, a sessão cairia após ~15 min (em desenvolvimento há um aviso no console). Teste logo ao receber o primeiro build.

## Estrutura

Segue a organização de `src` do curso (`assets`, `components`, `constants`, `hooks`, `screens`, `services`, `styles`, `types`, `utils`) e React Navigation (native-stack + bottom-tabs) — não Expo Router (ver `AGENTS.md`).

```
src/
  components/   # reutilizáveis: <Nome>/index.tsx (+ styles.ts, types.ts)
  context/      # Auth, Theme, Configuracoes (aluno), Chat (socket único por sessão)
  hooks/        # useAuth, useAppTheme, useChat, useCarregar, usePaginado, useBuscaDebounce…
  navigation/   # RootNavigator (guarda por estado), TabsNavigator (abas por papel), HeaderActions
  screens/      # <Tela>/<Tela>Screen.tsx (+ styles.ts)
  services/     # api.ts (axios + interceptors), auth/session, config e um service por área
  types/        # DTOs do backend (api.ts espelha api.models.ts do web)
  utils/        # datas, avatar, foto de perfil, erros…
docs/           # mapeamento-web-mobile.md
```

## Pendências e limites conhecidos

- **Testado no emulador Android (Pixel 9, Expo Go)** contra o backend do web: login dos quatro papéis, renovação da sessão após 15 min, chat em tempo real, foto de perfil (galeria), exportação PDF/Excel e as funções de cada papel. **Não testado:** iOS, foto pela câmera, build de produção (o Android bloqueia HTTP puro em build final: use HTTPS e `extra.apiBaseUrl`) e backend atrás de proxy reverso.
- **Cookie de refresh** — ver acima.
- **Origem do WebSocket**: o handshake passa sem cabeçalho `Origin` (comum no React Native). Se algum aparelho enviar `Origin` e o chat for recusado, a liberação precisa ser feita no backend (`nexo.cors.allowed-origins`).
- **Configurações do aluno**: só gamificação e privacidade; notificações, estudos, acessibilidade e aparência do servidor não foram migradas (o tema é local). Configurações de professor/diretor/admin também não.
- **Sobre / Suporte** (páginas estáticas do web) não foram migradas.
- **Data da avaliação e nascimento do professor** usam texto `AAAA-MM-DD` (sem seletor, para não adicionar dependência nativa).
- Os menus seguem exatamente os do web: o diretor não tem Contas/Catálogo (as telas existem para o admin).

## Visual

Logo, ícone e favicon são os do web (símbolo "N" roxo e logo v2; o login usa o painel roxo `#5B21B6` com a logo branca). A paleta segue os tokens do redesign do web (`nexo/src/styles/nexo-tokens.scss`, prefixo `--nx-*`), claro e escuro — ver o mapeamento no topo de [`src/styles/theme.ts`](src/styles/theme.ts). Botões, cabeçalho de login e barras de progresso são roxo sólido (o web só aprova gradiente nos blocos de XP). **Não migrado:** as fontes do web (Bricolage Grotesque e Figtree); o app usa a fonte do sistema.
