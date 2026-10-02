export interface Professor {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  disciplina?: string | null;
  telefone?: string | null;
  ativo: boolean;
  localDateTime?: string;
}

export interface Turno {
  id: number;
  nome: string;
  horaInicio: string; // "HH:mm:ss"
  horaFim: string; // "HH:mm:ss"
  ativo: boolean;
  dataCadastro?: string;
}

export interface Materia {
  id: number;
  nome: string;
  segmento: string;
  turmaIds?: number[];
  alunoIds?: number[];
}

export interface Turma {
  id: number;
  nome: string;
  anoLetivo: number;
  idTurno?: number | null;
  nomeTurno?: string | null;
  idProfessor?: number | null;
  nomeProfessor?: string | null;
  materiaIds?: number[];
}

export type ProfessorInput = Omit<Professor, 'id' | 'localDateTime'> & { id?: number };
export type TurnoInput = Omit<Turno, 'id' | 'dataCadastro'> & { id?: number };
export type MateriaInput = Omit<Materia, 'id'> & { id?: number };
export type TurmaInput = Omit<Turma, 'id'> & { id?: number };
