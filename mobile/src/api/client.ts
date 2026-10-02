import axios from 'axios';
import { API_BASE_URL } from './config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getErrorMessage(error: unknown, fallback = 'Não foi possível completar a operação.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e o endereço da API.';
    }
    const data = error.response.data as any;
    if (typeof data === 'string' && data.length > 0) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.response.status === 404) return 'Registro não encontrado.';
    if (error.response.status === 422) return 'Dados inválidos. Confira os campos e tente novamente.';
    if (error.response.status === 409) return 'Operação não permitida pelo servidor.';
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
