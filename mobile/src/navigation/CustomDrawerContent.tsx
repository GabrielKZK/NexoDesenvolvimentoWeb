import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../theme/ThemeContext';
import { iniciais } from '../utils/format';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { professor, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();

  const confirmarSaida = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={colors.brandGradient} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais(professor?.nome)}</Text>
        </View>
        <Text style={styles.nome} numberOfLines={1}>
          {professor?.nome ?? 'Professor'}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {professor?.email}
        </Text>
        {professor?.disciplina ? (
          <View style={styles.disciplinaBadge}>
            <Text style={styles.disciplinaText}>{professor.disciplina}</Text>
          </View>
        ) : null}
      </LinearGradient>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable onPress={toggleTheme} style={styles.footerRow}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.textSecondary} />
          <Text style={[styles.footerLabel, { color: colors.text }]}>
            Tema {isDark ? 'escuro' : 'claro'}
          </Text>
        </Pressable>
        <Pressable onPress={confirmarSaida} style={styles.footerRow}>
          <Ionicons name="log-out-outline" size={18} color={colors.status.danger} />
          <Text style={[styles.footerLabel, { color: colors.status.danger }]}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  nome: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  email: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  disciplinaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 10,
  },
  disciplinaText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});
