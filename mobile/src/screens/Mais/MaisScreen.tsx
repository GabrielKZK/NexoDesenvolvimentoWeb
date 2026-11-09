import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../hooks/useAuth';
import { RootStackParamList } from '../../navigation/types';
import { common } from '../../styles/common';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';

type Destino = 'Inscricoes' | 'Cadastro' | 'Auditoria' | 'PerfilStack';
interface Item {
  destino: Destino;
  titulo: string;
  descricao: string;
  icone: keyof typeof Ionicons.glyphMap;
}

const ITENS: Record<'diretor' | 'admin', Item[]> = {
  diretor: [
    { destino: 'Inscricoes', titulo: 'Inscrições', descricao: 'Alunos por turma, acesso e transferência', icone: 'school-outline' },
    { destino: 'Cadastro', titulo: 'Cadastro', descricao: 'Novo aluno ou professor', icone: 'person-add-outline' },
  ],
  admin: [
    { destino: 'Inscricoes', titulo: 'Inscrições', descricao: 'Alunos por turma, acesso e transferência', icone: 'school-outline' },
    { destino: 'Cadastro', titulo: 'Cadastro', descricao: 'Novo aluno', icone: 'person-add-outline' },
    { destino: 'Auditoria', titulo: 'Auditoria e logs', descricao: 'Saúde do sistema, eventos e erros', icone: 'shield-checkmark-outline' },
  ],
};

/** Aba "Mais" do diretor e do admin: telas de gestão que não cabem na barra inferior. */
export default function MaisScreen() {
  const { colors } = useAppTheme();
  const { usuario } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const itens = ITENS[usuario?.role === 'admin' ? 'admin' : 'diretor'];

  return (
    <ScreenContainer>
      {itens.map((i) => (
        <Pressable key={i.destino} onPress={() => navigation.navigate(i.destino)} accessibilityRole="button" accessibilityLabel={i.titulo}>
          <Card style={common.card}>
            <View style={common.row}>
              <View style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.input }}>
                <Ionicons name={i.icone} size={22} color={colors.brand.purple} />
              </View>
              <View style={common.flex}>
                <Text style={[common.title, { color: colors.text }]}>{i.titulo}</Text>
                <Text style={[common.sub, { color: colors.textSecondary }]}>{i.descricao}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </Card>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
