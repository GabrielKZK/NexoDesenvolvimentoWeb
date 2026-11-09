import type { ChatContato } from '../services/chatService';

export type RootStackParamList = {
  Login: undefined;
  TrocarSenha: undefined;
  Tabs: undefined;
  MateriaDetalhe: { materiaId: number; nome: string };
  Quiz: { desafioId: number; titulo: string };
  Configuracoes: undefined;
  /** Perfil aberto por cima das abas (papéis cujas abas não têm "Perfil"). */
  PerfilStack: undefined;
  Chat: undefined;
  Conversa: { contato: ChatContato };
  Inscricoes: undefined;
  Cadastro: undefined;
  Auditoria: undefined;
  CatalogoMateria: { materiaId: number; nome: string };
};

export type TabsParamList = {
  Inicio: undefined;
  Materias: undefined;
  Desafios: undefined;
  Notas: undefined;
  Perfil: undefined;
  Diario: undefined;
  NotasProf: undefined;
  Avaliacoes: undefined;
  Comunicacao: undefined;
  Evasao: undefined;
  Relatorios: undefined;
  Docentes: undefined;
  Contas: undefined;
  Catalogo: undefined;
  Mais: undefined;
};
