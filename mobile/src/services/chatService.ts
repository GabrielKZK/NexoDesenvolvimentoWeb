import { api } from './api';

export interface ChatContato {
  id: number;
  nome: string;
  papel: string;
  foto: string | null;
}

export interface ChatMensagem {
  id: number | null;
  de: number;
  deNome: string;
  para: number;
  texto: string;
  criadaEm: string;
}

/** Histórico e contatos do chat direto (o envio ao vivo é pelo chatSocket). */
export const chatService = {
  contatos: () => api.get<ChatContato[]>('/chat/contatos').then((r) => r.data),
  historico: (outroId: number) => api.get<ChatMensagem[]>(`/chat/${outroId}`).then((r) => r.data),
  /** Ticket de uso único (30 s) para autenticar o handshake do WebSocket. */
  wsTicket: () => api.get<{ ticket: string }>('/chat/ws-ticket').then((r) => r.data.ticket),
};
