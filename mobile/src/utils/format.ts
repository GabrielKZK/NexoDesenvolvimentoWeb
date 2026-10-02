/** "08:00:00" (LocalTime do backend) -> "08:00" (exibição) */
export function formatHora(hora?: string | null): string {
  if (!hora) return '--:--';
  return hora.slice(0, 5);
}

/** "08:00" (input do usuário) -> "08:00:00" (LocalTime esperado pelo backend) */
export function paraLocalTime(hora: string): string {
  const limpo = hora.trim();
  return limpo.length === 5 ? `${limpo}:00` : limpo;
}

export function iniciais(nome?: string | null): string {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/);
  const letras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return letras.join('') || '?';
}

export function pluralizar(qtd: number, singular: string, plural: string): string {
  return `${qtd} ${qtd === 1 ? singular : plural}`;
}
