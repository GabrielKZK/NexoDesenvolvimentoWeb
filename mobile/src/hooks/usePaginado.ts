import { useCallback, useEffect, useRef, useState } from 'react';
import { PageEnvelope } from '../types/api';
import { getErrorMessage } from '../utils/getErrorMessage';

/**
 * Lista paginada (`{content,page,totalPages…}`) com "carregar mais" para FlatList.
 * Refaz a busca da primeira página quando `chave` muda (filtros) e descarta respostas
 * de buscas antigas que cheguem atrasadas.
 */
export function usePaginado<T>(buscar: (page: number) => Promise<PageEnvelope<T>>, chave: string) {
  const [itens, setItens] = useState<T[]>([]);
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(0);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;
  const requisicao = useRef(0);

  const carregarPrimeira = useCallback(async (puxou = false) => {
    const id = ++requisicao.current;
    if (puxou) setAtualizando(true);
    else setCarregando(true);
    try {
      const r = await buscarRef.current(0);
      if (id !== requisicao.current) return;
      setItens(r.content);
      setPagina(0);
      setTotal(r.totalElements);
      setTemMais(r.page + 1 < r.totalPages);
      setErro(null);
    } catch (e) {
      if (id !== requisicao.current) return;
      setErro(getErrorMessage(e, 'Não foi possível carregar a lista.'));
    } finally {
      if (id === requisicao.current) {
        setCarregando(false);
        setAtualizando(false);
      }
    }
  }, []);

  useEffect(() => {
    void carregarPrimeira();
  }, [chave, carregarPrimeira]);

  const carregarMais = useCallback(async () => {
    if (!temMais || carregando || carregandoMais) return;
    const id = requisicao.current;
    setCarregandoMais(true);
    try {
      const r = await buscarRef.current(pagina + 1);
      if (id !== requisicao.current) return;
      setItens((atual) => [...atual, ...r.content]);
      setPagina(r.page);
      setTemMais(r.page + 1 < r.totalPages);
    } catch (e) {
      if (id === requisicao.current) setErro(getErrorMessage(e, 'Não foi possível carregar mais itens.'));
    } finally {
      setCarregandoMais(false);
    }
  }, [temMais, carregando, carregandoMais, pagina]);

  return {
    itens,
    setItens,
    total,
    temMais,
    carregando,
    carregandoMais,
    atualizando,
    erro,
    carregarMais,
    recarregar: () => carregarPrimeira(true),
    tentarDeNovo: () => carregarPrimeira(false),
  };
}
