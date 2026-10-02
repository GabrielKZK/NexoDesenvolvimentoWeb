import api from "./api";
import { AlunoCadastroDTO, AlunoDTO, LoginDTO } from "../types/aluno";

export async function cadastrarAluno(dto: AlunoCadastroDTO): Promise<AlunoDTO> {
  const response = await api.post<AlunoDTO>("/api/alunos/cadastrar", dto);
  return response.data;
}

export async function loginAluno(dto: LoginDTO): Promise<AlunoDTO> {
  const response = await api.post<AlunoDTO>("/api/alunos/login", dto);
  return response.data;
}

export async function redefinirSenha(
  emailInstitucional: string,
  novaSenha: string,
): Promise<void> {
  await api.patch("/api/alunos/senha/redefinir", { emailInstitucional, novaSenha });
}

export async function concluirTarefa(id: number): Promise<AlunoDTO> {
  const response = await api.post<AlunoDTO>(`/api/alunos/${id}/tarefas/concluir`);
  return response.data;
}

export async function definirMetaSemanal(id: number, xp: number): Promise<AlunoDTO> {
  const response = await api.patch<AlunoDTO>(`/api/alunos/${id}/meta`, null, {
    params: { xp },
  });
  return response.data;
}

export async function progressoDaMetaSemanal(id: number): Promise<number> {
  const response = await api.get<number>(`/api/alunos/${id}/progresso`);
  return response.data;
}

export async function top10Geral(): Promise<AlunoDTO[]> {
  const response = await api.get<AlunoDTO[]>("/api/alunos/ranking/top10");
  return response.data;
}
