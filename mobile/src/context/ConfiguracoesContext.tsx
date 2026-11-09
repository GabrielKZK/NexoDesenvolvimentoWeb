import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { configuracoesService } from '../services/configuracoesService';
import { ALUNO_DEFAULTS, AlunoSettings, SecaoAluno } from '../types/configuracoes';
import { getErrorMessage } from '../utils/getErrorMessage';

const DEBOUNCE_MS = 600;

export interface ConfiguracoesContextValue {
  /** Configurações do aluno (defaults até o servidor responder; outros papéis só veem os defaults). */
  aluno: AlunoSettings;
  /** Última falha ao gravar uma seção (a seção volta ao valor do servidor). */
  erroSync: string | null;
  atualizarAluno: <K extends SecaoAluno>(secao: K, patch: Partial<AlunoSettings[K]>) => void;
}

export const ConfiguracoesContext = createContext<ConfiguracoesContextValue | undefined>(undefined);

/** Junta o que o servidor devolveu aos defaults, seção a seção (campos novos nunca ficam undefined). */
function mesclar(servidor: Record<string, Record<string, unknown>>): AlunoSettings {
  return {
    gamificacao: { ...ALUNO_DEFAULTS.gamificacao, ...(servidor.gamificacao as object) },
    privacidade: { ...ALUNO_DEFAULTS.privacidade, ...(servidor.privacidade as object) },
  } as AlunoSettings;
}

/**
 * Equivalente ao SettingsStore do web, para o aluno: GET /api/configuracoes ao entrar
 * ("servidor vence") e PATCH /api/configuracoes/{secao} com debounce a cada alteração.
 */
export const ConfiguracoesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  const ehAluno = usuario?.role === 'aluno' && !usuario.precisaTrocarSenha;
  const usuarioId = usuario?.id;

  const [aluno, setAluno] = useState<AlunoSettings>(ALUNO_DEFAULTS);
  const [erroSync, setErroSync] = useState<string | null>(null);

  const atual = useRef(aluno);
  atual.current = aluno;
  /** Último valor confirmado pelo servidor por seção — para desfazer se o PATCH falhar. */
  const confirmado = useRef<AlunoSettings>(ALUNO_DEFAULTS);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pendentes = timers.current;
    pendentes.forEach(clearTimeout);
    pendentes.clear();
    setErroSync(null);

    if (!ehAluno) {
      setAluno(ALUNO_DEFAULTS);
      confirmado.current = ALUNO_DEFAULTS;
      return;
    }
    let ativo = true;
    configuracoesService
      .obter()
      .then((servidor) => {
        if (!ativo) return;
        const mesclado = mesclar(servidor);
        confirmado.current = mesclado;
        setAluno(mesclado);
      })
      .catch(() => {
        /* servidor indisponível: segue com os defaults */
      });
    return () => {
      ativo = false;
      pendentes.forEach(clearTimeout);
      pendentes.clear();
    };
  }, [ehAluno, usuarioId]);

  const atualizarAluno = useCallback<ConfiguracoesContextValue['atualizarAluno']>((secao, patch) => {
    setAluno((s) => ({ ...s, [secao]: { ...s[secao], ...patch } }));
    setErroSync(null);

    const anterior = timers.current.get(secao);
    if (anterior) clearTimeout(anterior);
    timers.current.set(
      secao,
      setTimeout(async () => {
        timers.current.delete(secao);
        const valores = atual.current[secao];
        try {
          const resposta = await configuracoesService.atualizarSecao(secao, valores as unknown as Record<string, unknown>);
          confirmado.current = { ...confirmado.current, [secao]: mesclar(resposta)[secao] };
        } catch (e) {
          setErroSync(getErrorMessage(e, 'Não foi possível salvar a configuração.'));
          setAluno((s) => ({ ...s, [secao]: confirmado.current[secao] }));
        }
      }, DEBOUNCE_MS),
    );
  }, []);

  const value = useMemo(() => ({ aluno, erroSync, atualizarAluno }), [aluno, erroSync, atualizarAluno]);
  return <ConfiguracoesContext.Provider value={value}>{children}</ConfiguracoesContext.Provider>;
};
