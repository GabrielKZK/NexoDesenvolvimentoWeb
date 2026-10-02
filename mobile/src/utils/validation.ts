export function isEmailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isHoraValida(hora: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora.trim());
}
