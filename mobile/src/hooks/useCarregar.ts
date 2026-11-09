import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getErrorMessage } from '../utils/getErrorMessage';

/**
 * Carrega dados da API ao abrir a tela e sempre que ela volta ao foco (ex.: o XP muda
 * depois de um quiz). Mantém os dados anteriores na tela durante o recarregamento.
 */
export function useCarregar<T>(buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  const carregar = useCallback(async (puxou = false) => {
    if (puxou) setAtualizando(true);
    try {
      setDados(await buscarRef.current());
      setErro(null);
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível carregar os dados.'));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  return { dados, setDados, carregando, atualizando, erro, recarregar: () => carregar(true) };
}
