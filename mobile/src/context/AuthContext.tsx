import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Professor } from '../types/models';
import { professorService } from '../api/professorService';
import { getErrorMessage } from '../api/client';

const CREDENTIALS_KEY = 'nexo.professor.credentials';

interface Credentials {
  email: string;
  senha: string;
}

interface AuthContextValue {
  professor: Professor | null;
  booting: boolean;
  signingIn: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfessor: () => Promise<void>;
  setProfessor: (professor: Professor) => void;
  applyProfileUpdate: (updated: Professor, novaSenha?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

  const logout = async () => {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY).catch(() => {});
    setProfessorState(null);
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
      value={{ professor, booting, signingIn, login, logout, refreshProfessor, setProfessor, applyProfileUpdate }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
