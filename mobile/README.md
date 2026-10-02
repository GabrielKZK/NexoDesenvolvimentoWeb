# Menu do Professor — App Mobile

App em **React Native (Expo + TypeScript)** com o menu/área do professor, consumindo a API Spring Boot deste repositório (`src/main/java/com/nexo/projeto`).

## Funcionalidades

- **Login do professor** (e-mail/senha), com sessão persistida de forma segura no aparelho.
- **Dashboard**: saudação, contadores (turmas/matérias/turnos) e atalhos de menu.
- **Turmas**: listar, criar, editar, excluir; vincular/desvincular matérias; escolher turno e professor responsável.
- **Matérias**: listar, criar, editar, excluir.
- **Turnos**: listar, criar, editar, excluir; horário de início/fim e status ativo/inativo.
- **Perfil**: editar dados do professor, trocar senha, alternar tema claro/escuro, sair.
- Tema claro/escuro com a paleta de marca do projeto principal (roxo `#9b2fff` → verde `#06d25e`), persistido entre aberturas do app.

## Como rodar

```bash
cd mobile
npm install
npx expo start
```

Abra no Expo Go (celular físico) ou em um emulador Android/iOS a partir do QR Code/menu do Metro.

## Configurando o endereço da API

O backend Spring Boot roda por padrão em `http://localhost:8080` (sem context-path). O arquivo [`src/api/config.ts`](src/api/config.ts) já resolve o host correto automaticamente:

- **Emulador Android**: usa `http://10.0.2.2:8080` (não precisa mexer em nada).
- **iOS Simulator**: usa `http://localhost:8080` (não precisa mexer em nada).
- **Celular físico** (Expo Go): edite a constante `LAN_IP` em `src/api/config.ts` com o IP da sua máquina na rede local (ex.: `'192.168.0.10'`). O celular e o computador precisam estar na mesma rede Wi-Fi.

Lembre-se de deixar o backend rodando (`./mvnw spring-boot:run` na raiz do projeto) e o Postgres acessível antes de testar o app.

## ⚠️ Sobre o login do professor

O backend **ainda não possui um endpoint de login dedicado para professores** (`ProfessorController` só tem CRUD — o único `/login` existente é o de aluno, em `AlunoController`). Para o app funcionar hoje, o login é feito localmente: ele busca `GET /api/professores`, encontra o cadastro pelo e-mail e confere a senha no próprio aparelho (veja `src/context/AuthContext.tsx`).

Isso funciona para desenvolvimento/apresentação, mas **não é seguro para produção** (a senha de todos os professores trafega em texto puro ao listar professores). Quando o backend ganhar um endpoint como `POST /api/professores/login` (idealmente com senha criptografada e retorno de token), troque a função `autenticar()` em `AuthContext.tsx` por uma chamada a esse endpoint.

## Estrutura

```
src/
  api/           # axios + services (professor, turma, materia, turno)
  components/    # botões, inputs, cards, badges, etc. (reutilizáveis e com tema)
  context/       # AuthContext (sessão do professor)
  navigation/    # stacks, drawer e tipos de navegação
  screens/       # telas por módulo (Auth, Dashboard, Turmas, Materias, Turnos, Perfil)
  theme/         # paleta de cores + ThemeContext (claro/escuro)
  types/         # tipos espelhando os DTOs do backend
  utils/         # formatação e validação
```
