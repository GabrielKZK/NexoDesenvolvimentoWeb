import { useEffect, useState } from 'react';
import { professorService } from '../services/professorService';
import { TurmaDTO } from '../types/api';
import { getErrorMessage } from '../utils/getErrorMessage';

/** Carrega "minhas turmas" (o servidor já recorta pelo docente) e mantém uma selecionada. */
export function useTurmaSelecionada() {
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    professorService
      .turmas()
      .then((lista) => {
        if (!ativo) return;
        setTurmas(lista);
        setTurmaId((atual) => atual ?? lista[0]?.id ?? null);
      })
      .catch((e) => ativo && setErro(getErrorMessage(e, 'Não foi possível carregar as turmas.')))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  return { turmas, turmaId, setTurmaId, carregando, erro, recarregar: () => setTentativa((t) => t + 1) };
}
