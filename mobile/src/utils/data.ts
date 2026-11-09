/** Datas "yyyy-MM-dd" no fuso local (o backend usa LocalDate para a chamada do dia). */
const doisDigitos = (n: number) => String(n).padStart(2, '0');

export function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
}

export function somarDias(iso: string, dias: number): string {
  const [a, m, d] = iso.split('-').map(Number);
  const nova = new Date(a, m - 1, d + dias);
  return `${nova.getFullYear()}-${doisDigitos(nova.getMonth() + 1)}-${doisDigitos(nova.getDate())}`;
}

/** "08 de nov. de 2026" a partir de "2026-11-08" ou de um ISO com horário. */
export function formatarDataBR(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Aceita "7,5" ou "7.5"; vazio ou inválido vira null. */
export function lerNota(texto: string): number | null {
  const t = texto.trim();
  if (!t) return null;
  const n = Number(t.replace(',', '.'));
  return Number.isNaN(n) ? null : n;
}

export function formatarNota(n: number | null | undefined): string {
  return n == null ? '' : String(n).replace('.', ',');
}
