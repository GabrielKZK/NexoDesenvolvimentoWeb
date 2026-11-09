import { useContext } from 'react';
import { ConfiguracoesContext } from '../context/ConfiguracoesContext';

export function useConfiguracoes() {
  const ctx = useContext(ConfiguracoesContext);
  if (!ctx) throw new Error('useConfiguracoes deve ser usado dentro de ConfiguracoesProvider');
  return ctx;
}
