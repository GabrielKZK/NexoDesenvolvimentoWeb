import React from 'react';
import { EmptyState } from '../EmptyState';
import { LoadingView } from '../LoadingView';

interface AsyncStateProps {
  carregando: boolean;
  erro: string | null;
  temDados: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

/** Carregando → spinner; falha sem dados → erro com "tentar de novo"; senão o conteúdo. */
export const AsyncState: React.FC<AsyncStateProps> = ({ carregando, erro, temDados, onRetry, children }) => {
  if (carregando && !temDados) return <LoadingView label="Carregando..." />;
  if (erro && !temDados) {
    return <EmptyState icon="cloud-offline-outline" title="Não foi possível carregar" subtitle={erro} actionLabel="Tentar de novo" onAction={onRetry} />;
  }
  return <>{children}</>;
};
