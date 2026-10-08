# Nexo — App Mobile

App único em **React Native (Expo + TypeScript)** com a área do **professor** e a área do **aluno**, consumindo a API Spring Boot deste repositório (`backend/src/main/java/com/nexo/projeto`). Na tela de login/cadastro o usuário escolhe se entra como Professor ou Aluno.

## Funcionalidades

### Professor

- **Login do professor** (e-mail/senha), com sessão persistida de forma segura no aparelho.
- **Dashboard**: saudação, contadores (turmas/matérias/turnos) e atalhos de menu.
- **Turmas**: listar, criar, editar, excluir; vincular/desvincular matérias; escolher turno e professor responsável.
- **Matérias**: listar, criar, editar, excluir.
- **Turnos**: listar, criar, editar, excluir; horário de início/fim e status ativo/inativo.
- **Perfil**: editar dados do professor, trocar senha, alternar tema claro/escuro, sair.

### Aluno

- **Login e cadastro** de aluno (e-mail institucional/senha) e recuperação de senha.
- **Dashboard**: XP total, ofensiva, meta semanal (com barra de progresso), tarefas do dia e ranking Top 10.
- **Matérias**: listar, buscar e abrir o detalhe de cada disciplina.

### Geral

- Tema claro/escuro com a paleta de marca do projeto principal (roxo `#9b2fff` → verde `#06d25e`), persistido entre aberturas do app.

## Como rodar

```bash
cd mobile
npm install
npx expo start
```

Abra no Expo Go (celular físico) ou em um emulador Android/iOS a partir do QR Code/menu do Metro.

## Configurando o endereço da API

O backend Spring Boot roda por padrão em `http://localhost:8080` (sem context-path). O arquivo [`src/services/config.ts`](src/services/config.ts) já resolve o host correto automaticamente:

- **Emulador Android**: usa `http://10.0.2.2:8080` (não precisa mexer em nada).
- **iOS Simulator**: usa `http://localhost:8080` (não precisa mexer em nada).
- **Celular físico** (Expo Go): o IP do computador é detectado automaticamente a partir do Expo (não precisa editar nada ao trocar de rede). Se a detecção falhar, preencha `LAN_IP_OVERRIDE` em `src/services/config.ts` (ex.: `'192.168.0.10'`). O celular e o computador precisam estar na mesma rede Wi-Fi.

Lembre-se de deixar o backend rodando e o Postgres acessível antes de testar o app. A senha do banco não fica no repositório: defina a variável `DB_PASSWORD` (ou copie `application-local.properties.example` para `application-local.properties` dentro de `backend/`) e rode `./mvnw spring-boot:run` dentro de `backend/`. Os endpoints seguem o padrão `/api/<recurso>` (`/api/turmas`, `/api/materias`, `/api/professores`, `/api/turnos`, `/api/alunos`).

## ⚠️ Sobre o login do professor

O backend **ainda não possui um endpoint de login dedicado para professores** (`ProfessorController` só tem CRUD — o único `/login` existente é o de aluno, em `AlunoController`). Para o app funcionar hoje, o login é feito localmente: ele busca `GET /api/professores`, encontra o cadastro pelo e-mail e confere a senha no próprio aparelho (veja `src/context/AuthContext.tsx`).

Isso funciona para desenvolvimento/apresentação, mas **não é seguro para produção** (a senha de todos os professores trafega em texto puro ao listar professores). Quando o backend ganhar um endpoint como `POST /api/professores/login` (idealmente com senha criptografada e retorno de token), troque a função `autenticar()` em `AuthContext.tsx` por uma chamada a esse endpoint.

## Estrutura

Segue a organização de projeto apresentada em aula (`src` com `assets`, `components`, `constants`, `hooks`, `screens`, `services`, `styles`, `types`, `utils`):

```
src/
  assets/images/   # logo e imagens
  components/      # componentes reutilizáveis: <Nome>/index.tsx + styles.ts + types.ts
  constants/       # constantes (chaves de storage, tamanho mínimo de senha, cores de segmento)
  context/         # AuthContext (sessão de professor/aluno) e ThemeContext
  hooks/           # useAuth, useAppTheme
  navigation/      # stacks, drawer (professor), stack do aluno e tipos de navegação
  screens/         # <Tela>/<Tela>Screen.tsx + styles.ts + types.ts
  services/        # api.ts (axios) + services por recurso (professor, turma, materia, turno, aluno)
  styles/          # theme.ts: paleta de cores claro/escuro
  types/           # tipos espelhando os DTOs do backend
  utils/           # formatação, validação, getErrorMessage, etc.
```
