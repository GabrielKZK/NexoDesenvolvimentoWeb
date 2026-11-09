import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ChatMensagem } from '../services/chatService';
import { chatSocket } from '../services/chatSocket';

export interface ChatContextValue {
  /** Socket aberto e autenticado. */
  conectado: boolean;
  /** Mensagens recebidas de cada contato desde que o app abriu e ainda não vistas (id do contato → qtd). */
  naoLidas: Record<number, number>;
  totalNaoLidas: number;
  enviar: (para: number, texto: string) => boolean;
  /** Assina as mensagens ao vivo (minhas e dos outros). Devolve a função de cancelar. */
  assinar: (fn: (msg: ChatMensagem) => void) => () => void;
  /** Informa qual conversa está na tela (mensagens dela não contam como não lidas). */
  definirConversaAberta: (contatoId: number | null) => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

/**
 * Mantém UM socket por sessão (como o ChatSocketService singleton do web): conecta quando há
 * usuário de papel com chat (aluno/professor/diretor) sem troca de senha pendente, derrubando-o
 * no logout ou na troca de conta. Ao voltar do segundo plano reabre na hora, se o SO o matou.
 */
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  const usuarioId = usuario && !usuario.precisaTrocarSenha && usuario.role !== 'admin' ? usuario.id : null;

  const [conectado, setConectado] = useState(false);
  const [naoLidas, setNaoLidas] = useState<Record<number, number>>({});
  const conversaAberta = useRef<number | null>(null);

  useEffect(() => {
    setNaoLidas({});
    if (usuarioId === null) {
      chatSocket.desconectar();
      return;
    }
    chatSocket.conectar(usuarioId);

    const offStatus = chatSocket.aoMudarStatus(setConectado);
    setConectado(chatSocket.estaConectado);
    const offMsg = chatSocket.aoReceber((msg) => {
      if (msg.de === usuarioId || msg.de === conversaAberta.current) return;
      setNaoLidas((atual) => ({ ...atual, [msg.de]: (atual[msg.de] ?? 0) + 1 }));
    });
    const appState = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') chatSocket.reconectarAgora();
    });

    return () => {
      offStatus();
      offMsg();
      appState.remove();
      chatSocket.desconectar();
    };
  }, [usuarioId]);

  const definirConversaAberta = useCallback((contatoId: number | null) => {
    conversaAberta.current = contatoId;
    if (contatoId === null) return;
    setNaoLidas((atual) => {
      if (!atual[contatoId]) return atual;
      const { [contatoId]: _, ...resto } = atual;
      return resto;
    });
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      conectado,
      naoLidas,
      totalNaoLidas: Object.values(naoLidas).reduce((soma, n) => soma + n, 0),
      enviar: chatSocket.enviar.bind(chatSocket),
      assinar: chatSocket.aoReceber.bind(chatSocket),
      definirConversaAberta,
    }),
    [conectado, naoLidas, definirConversaAberta],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
