import { useEffect, useState } from 'react';

/** Devolve `valor` só depois de `ms` sem mudar (campo de busca → consulta ao servidor). */
export function useBuscaDebounce(valor: string, ms = 400) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setAtrasado(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return atrasado.trim();
}
