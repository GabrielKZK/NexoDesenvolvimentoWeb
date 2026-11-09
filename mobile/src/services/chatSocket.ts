import { WS_URL } from './config';
import { ChatMensagem, chatService } from './chatService';

const RECONEXAO_MS = 3000;

type OuvinteMensagem = (msg: ChatMensagem) => void;
type OuvinteStatus = (conectado: boolean) => void;

/**
 * Cliente WebSocket do chat (equivale ao ChatSocketService do web). Cada conexão troca o
 * access token por um ticket de uso único (GET /api/chat/ws-ticket) e abre
 * `ws(s)://host/ws/chat?ticket=…`. Reconecta a cada 3 s com um ticket novo; ao trocar de
 * conta derruba o socket antigo para as mensagens nunca saírem como o usuário errado.
 */
class ChatSocket {
  private socket: WebSocket | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private usuarioId: number | null = null;
  /** Incrementa a cada conectar/desconectar: descarta respostas de tentativas antigas. */
  private geracao = 0;
  private conectado = false;
  /** Há uma busca de ticket em andamento (evita abrir dois sockets). */
  private abrindo = false;
  private ouvintesMsg = new Set<OuvinteMensagem>();
  private ouvintesStatus = new Set<OuvinteStatus>();

  get estaConectado() {
    return this.conectado;
  }

  aoReceber(fn: OuvinteMensagem) {
    this.ouvintesMsg.add(fn);
    return () => {
      this.ouvintesMsg.delete(fn);
    };
  }

  aoMudarStatus(fn: OuvinteStatus) {
    this.ouvintesStatus.add(fn);
    return () => {
      this.ouvintesStatus.delete(fn);
    };
  }

  conectar(usuarioId: number) {
    if (this.usuarioId === usuarioId) return;
    this.desconectar();
    this.usuarioId = usuarioId;
    void this.abrir(this.geracao);
  }

  desconectar() {
    this.geracao += 1;
    this.usuarioId = null;
    this.abrindo = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.fecharSocket();
    this.definirStatus(false);
  }

  /** Volta do segundo plano: o SO costuma matar o socket; reabre já, sem esperar os 3 s. */
  reconectarAgora() {
    if (this.usuarioId === null || this.socket) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    void this.abrir(this.geracao);
  }

  enviar(para: number, texto: string): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify({ para, texto }));
    return true;
  }

  private async abrir(geracao: number) {
    if (this.abrindo) return;
    this.abrindo = true;
    try {
      const ticket = await chatService.wsTicket();
      if (geracao !== this.geracao) return; // desconectou/trocou de conta durante a busca
      this.abrindo = false;
      const ws = new WebSocket(`${WS_URL}/chat?ticket=${encodeURIComponent(ticket)}`);
      this.socket = ws;
      ws.onopen = () => {
        if (geracao === this.geracao) this.definirStatus(true);
      };
      ws.onmessage = (ev) => {
        if (geracao !== this.geracao) return;
        try {
          const msg = JSON.parse(String(ev.data)) as ChatMensagem;
          this.ouvintesMsg.forEach((fn) => fn(msg));
        } catch {
          /* payload inesperado: ignora */
        }
      };
      ws.onerror = () => {
        /* o onclose que segue cuida da reconexão */
      };
      ws.onclose = () => {
        if (geracao !== this.geracao) return;
        this.socket = null;
        this.definirStatus(false);
        this.agendarReconexao(geracao);
      };
    } catch {
      if (geracao === this.geracao) {
        this.abrindo = false;
        this.agendarReconexao(geracao);
      }
    }
  }

  private agendarReconexao(geracao: number) {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      if (geracao === this.geracao && this.usuarioId !== null) void this.abrir(geracao);
    }, RECONEXAO_MS);
  }

  private fecharSocket() {
    const antigo = this.socket;
    this.socket = null;
    if (!antigo) return;
    antigo.onopen = antigo.onmessage = antigo.onerror = antigo.onclose = null;
    try {
      antigo.close();
    } catch {
      /* já encerrado */
    }
  }

  private definirStatus(conectado: boolean) {
    if (this.conectado === conectado) return;
    this.conectado = conectado;
    this.ouvintesStatus.forEach((fn) => fn(conectado));
  }
}

export const chatSocket = new ChatSocket();
