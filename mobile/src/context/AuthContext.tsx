import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import * as authService from '../services/authService';
import { session } from '../services/session';
import { Usuario } from '../types/auth';
import { getErrorMessage } from '../utils/getErrorMessage';

export interface AuthContextValue {
  usuario: Usuario | null;
  /** Lendo o disco / renovando a sessão no arranque. */
  booting: boolean;
  signingIn: boolean;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Atualiza o perfil local após editar perfil ou trocar a senha provisória. */
  atualizarUsuario: (patch: Partial<Pick<Usuario, 'nome' | 'foto' | 'cargo' | 'precisaTrocarSenha'>>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [booting, setBooting] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  // Renovação recusada em qualquer chamada (interceptor) → volta ao login.
  useEffect(() => {
    session.setOnExpired(() => setUsuario(null));
    return () => session.setOnExpired(null);
  }, []);

  // Equivalente ao restaurarSessao() do web: o access token vive só em memória, então
  // no arranque a sessão é refeita a partir do refresh token guardado.
  useEffect(() => {
    (async () => {
      try {
        const { usuario: salvo, temRefresh } = await session.load();
        if (!salvo || !temRefresh) {
          if (salvo || temRefresh) await session.clear();
          return;
        }
        try {
          setUsuario(await authService.renovar());
        } catch (e) {
          if (authService.sessaoRecusada(e)) {
            await session.clear(); // cookie vencido ou revogado
          } else {
            // Sem rede: mantém o perfil em cache; o interceptor renova na primeira chamada que tomar 401.
            setUsuario(salvo);
          }
        }
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = useCallback(async (loginInformado: string, senha: string) => {
    setSigningIn(true);
    try {
      setUsuario(await authService.login(loginInformado, senha));
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        throw new Error('Login ou senha incorretos.');
      }
      throw new Error(getErrorMessage(e, 'Não foi possível entrar. Tente novamente.'));
    } finally {
      setSigningIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUsuario(null);
  }, []);

  const atualizarUsuario = useCallback<AuthContextValue['atualizarUsuario']>((patch) => {
    setUsuario((atual) => {
      if (!atual) return atual;
      const novo = { ...atual, ...patch };
      void session.saveUsuario(novo);
      return novo;
    });
  }, []);

  const value = useMemo(
    () => ({ usuario, booting, signingIn, login, logout, atualizarUsuario }),
    [usuario, booting, signingIn, login, logout, atualizarUsuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
