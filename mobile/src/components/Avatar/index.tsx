import React from 'react';
import { Image, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { resolverFoto } from '../../utils/avatar';
import { hexToRgba } from '../../utils/color';

interface AvatarProps {
  nome: string;
  foto?: string | null;
  size?: number;
}

/** Foto de perfil redonda; sem foto (ou se falhar) mostra a inicial do nome. */
export const Avatar: React.FC<AvatarProps> = ({ nome, foto, size = 44 }) => {
  const { colors } = useAppTheme();
  const [falhou, setFalhou] = React.useState(false);
  const uri = resolverFoto(foto);
  const base = { width: size, height: size, borderRadius: size / 2 };

  if (uri && !falhou) {
    return <Image source={{ uri }} style={base} onError={() => setFalhou(true)} accessibilityIgnoresInvertColors />;
  }
  return (
    <View style={[base, { alignItems: 'center', justifyContent: 'center', backgroundColor: hexToRgba(colors.brand.purple, 0.16) }]}>
      <Text style={{ color: colors.brand.purple, fontWeight: '800', fontSize: size * 0.4 }}>
        {nome.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
};
