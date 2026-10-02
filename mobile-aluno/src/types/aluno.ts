export interface AlunoDTO {
  id: number;
  nome: string;
  emailInstitucional: string;
  foto: string | null;
  xpTotal: number;
  xpSemana: number;
  metaSemanalXp: number;
  ofensivaDias: number;
  tarefasFeitasHoje: number;
  tarefasHoje: number;
}

export interface AlunoCadastroDTO {
  nome: string;
  emailInstitucional: string;
  senha: string;
  foto?: string;
}

export interface LoginDTO {
  emailInstitucional: string;
  senha: string;
}
