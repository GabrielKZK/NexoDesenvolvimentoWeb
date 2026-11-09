import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface SegmentedProps<T extends string> {
  opcoes: { valor: T; rotulo: string }[];
  valor: T;
  onChange: (valor: T) => void;
}

/** Abas internas de uma tela (ex.: Mensagens | Dúvidas | Avisos). Divide a largura igualmente. */
export function Segmented<T extends string>({ opcoes, valor, onChange }: SegmentedProps<T>) {
  const { colors } = useAppTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', backgroundColor: colors.input, borderRadius: 12, padding: 3, marginBottom: 14 }}
    >
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            onPress={() => onChange(o.valor)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            style={{
              flex: 1,
              minHeight: 38,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              paddingHorizontal: 4,
              backgroundColor: ativo ? colors.card : 'transparent',
            }}
          >
            <Text
              numberOfLines={1}
              style={{ fontSize: 12.5, fontWeight: '700', color: ativo ? colors.brand.purple : colors.textSecondary }}
            >
              {o.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
