import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Aluno, AlunoCadastroInput, Professor } from '../types/models';
import { professorService } from '../services/professorService';
import { alunoService } from '../services/alunoService';
import { getErrorMessage } from '../utils/getErrorMessage';
import { CREDENTIALS_KEY } from '../constants/storage';

interface Credentials {
  email: string;
  senha: string;
}

export interface AuthContextValue {
  professor: Professor | null;
  aluno: Aluno | null;
  booting: boolean;
  signingIn: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginAluno: (emailInstitucional: string, senha: string) => Promise<void>;
  cadastrarAluno: (dto: AlunoCadastroInput) => Promise<void>;
  setAluno: (aluno: Aluno) => void;
  logout: () => Promise<void>;
  refreshProfessor: () => Promise<void>;
  setProfessor: (professor: Professor) => void;
  applyProfileUpdate: (updated: Professor, novaSenha?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Chama POST /api/professores/login e traduz os status de erro em mensagens legíveis. */
async function autenticar({ email, senha }: Credentials): Promise<Professor> {
  try {
    return await professorService.login(email.trim(), senha);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401) throw new Error('E-mail ou senha incorretos.');
      if (e.response?.status === 403) throw new Error('Este cadastro de professor está inativo.');
    }
    throw new Error(getErrorMessage(e, 'Não foi possível entrar. Tente novamente.'));
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professor, setProfessorState] = useState<Professor | null>(null);
  const [aluno, setAlunoState] = useState<Aluno | null>(null);
  const [booting, setBooting] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (raw) {
          const credentials: Credentials = JSON.parse(raw);
          const prof = await autenticar(credentials);
          setProfessorState(prof);
        }
      } catch (e) {
        // Sessão salva ficou inválida (senha alterada, professor removido, etc.)
        await SecureStore.deleteItemAsync(CREDENTIALS_KEY).catch(() => {});
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = async (email: string, senha: string) => {
    setSigningIn(true);
    try {
      const prof = await autenticar({ email, senha });
      await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify({ email: email.trim(), senha }));
      setProfessorState(prof);
    } finally {
      setSigningIn(false);
    }
  };

  /** Login do aluno: a sessão fica só em memória (o backend devolve o AlunoDTO completo). */
  const loginAluno = async (emailInstitucional: string, senha: string) => {
    setSigningIn(true);
    try {
      const logado = await alunoService.login({ emailInstitucional: emailInstitucional.trim(), senha });
      setAlunoState(logado);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        throw new Error('E-mail ou senha incorretos.');
      }
      throw new Error(getErrorMessage(e, 'Não foi possível entrar. Verifique sua conexão.'));
    } finally {
      setSigningIn(false);
    }
  };

  const cadastrarAluno = async (dto: AlunoCadastroInput) => {
    setSigningIn(true);
    try {
      const criado = await alunoService.cadastrar(dto);
      setAlunoState(criado);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        throw new Error('Dados inválidos. Confira os campos preenchidos.');
      }
      throw new Error(getErrorMessage(e, 'Não foi possível cadastrar. Verifique sua conexão.'));
    } finally {
      setSigningIn(false);
    }
  };

  const setAluno = (a: Aluno) => setAlunoState(a);

  const logout = async () => {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY).catch(() => {});
    setProfessorState(null);
    setAlunoState(null);
  };

  const refreshProfessor = async () => {
    if (!professor) return;
    try {
      const atualizado = await professorService.buscarPorId(professor.id);
      setProfessorState(atualizado);
    } catch (e) {
      // mantém os dados em cache se a rede falhar
    }
  };

  const setProfessor = (p: Professor) => setProfessorState(p);

  /** Atualiza o estado local e as credenciais salvas após uma edição de perfil. */
  const applyProfileUpdate = async (updated: Professor, novaSenha?: string) => {
    setProfessorState(updated);
    try {
      // A API nunca devolve a senha real (fica null no DTO), então mantemos a
      // senha atual salva localmente a menos que o professor tenha trocado.
      const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
      const atuais: Credentials | null = raw ? JSON.parse(raw) : null;
      const senhaParaSalvar = novaSenha ?? atuais?.senha;
      if (senhaParaSalvar) {
        await SecureStore.setItemAsync(
          CREDENTIALS_KEY,
          JSON.stringify({ email: updated.email, senha: senhaParaSalvar })
        );
      }
    } catch {
      // mantém a sessão atual mesmo se não conseguir persistir as credenciais
    }
  };

  return (
    <AuthContext.Provider
      value={{
        professor,
        aluno,
        booting,
        signingIn,
        login,
        loginAluno,
        cadastrarAluno,
        setAluno,
        logout,
        refreshProfessor,
        setProfessor,
        applyProfileUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
