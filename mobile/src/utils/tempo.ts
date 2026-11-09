/** "há 5 min", "há 2 h", "há 3 dias" a partir de um ISO-8601. */
export function tempoRelativo(iso: string, agora = Date.now()): string {
  const diffMin = Math.max(0, Math.round((agora - new Date(iso).getTime()) / 60000));
  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `há ${diffMin} min`;
  const horas = Math.round(diffMin / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.round(horas / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}
