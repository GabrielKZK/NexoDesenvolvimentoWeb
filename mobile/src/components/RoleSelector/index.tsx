import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { UserRole } from '../../types/models';
import { styles } from './styles';
import { RoleSelectorProps } from './types';

const OPTIONS: { role: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { role: 'professor', label: 'Professor', icon: 'school-outline' },
  { role: 'aluno', label: 'Aluno', icon: 'person-outline' },
];

export const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.input, borderColor: colors.border }]}>
      {OPTIONS.map((option) => {
        const selected = option.role === value;
        return (
          <Pressable
            key={option.role}
            onPress={() => onChange(option.role)}
            style={[styles.option, selected && { backgroundColor: colors.brand.purple }]}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={selected ? '#fff' : colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.label, { color: selected ? '#fff' : colors.textSecondary }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
