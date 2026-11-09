import React from 'react';
import { ScrollView } from 'react-native';
import { Chip } from '../Chip';

interface ChipRowProps<T extends string | number> {
  opcoes: { valor: T; rotulo: string }[];
  valor: T | null;
  onChange: (valor: T) => void;
}

/** Seletor horizontal de uma opção (turma, matéria, tipo…), com rolagem quando não cabe. */
export function ChipRow<T extends string | number>({ opcoes, valor, onChange }: ChipRowProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
      {opcoes.map((o) => (
        <Chip key={String(o.valor)} label={o.rotulo} selected={o.valor === valor} onPress={() => onChange(o.valor)} />
      ))}
    </ScrollView>
  );
}
