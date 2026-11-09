import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ProgressBarProps {
  /** 0–100 (valores fora da faixa são limitados). */
  percent: number;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent, color, height = 8 }) => {
  const { colors } = useAppTheme();
  const largura = Math.max(0, Math.min(100, percent));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(largura) }}
      style={{ height, borderRadius: height / 2, backgroundColor: colors.border, overflow: 'hidden' }}
    >
      <View
        style={{ width: `${largura}%`, height: '100%', borderRadius: height / 2, backgroundColor: color ?? colors.brand.purple }}
      />
    </View>
  );
};
