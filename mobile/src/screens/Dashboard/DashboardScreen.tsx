import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ScreenContainer } from '../../components/ScreenContainer';
import { MenuCard } from '../../components/MenuCard';
import { StatPill } from '../../components/StatPill';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { turmaService } from '../../services/turmaService';
import { materiaService } from '../../services/materiaService';
import { turnoService } from '../../services/turnoService';
import { Turma } from '../../types/models';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { styles } from './styles';
import { DashboardScreenProps } from './types';

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { professor } = useAuth();
  const { colors } = useAppTheme();

  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [totalMaterias, setTotalMaterias] = useState(0);
  const [totalTurnos, setTotalTurnos] = useState(0);
  const [minhasTurmas, setMinhasTurmas] = useState<Turma[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const [turmas, materias, turnos] = await Promise.all([
        turmaService.listarTodas(),
        materiaService.listarTodas(),
        turnoService.listarTodos(),
      ]);
      setTotalTurmas(turmas.length);
      setTotalMaterias(materias.length);
      setTotalTurnos(turnos.length);
      setMinhasTurmas(turmas.filter((t) => t.idProfessor === professor?.id).slice(0, 3));
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, [professor?.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregar();
  };

  const primeiroNome = professor?.nome?.split(' ')[0] ?? 'Professor(a)';

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      <Text style={[styles.saudacao, { color: colors.textSecondary }]}>Olá,</Text>
      <Text style={[styles.nome, { color: colors.text }]}>{primeiroNome} 👋</Text>

      {erro && (
        <Card style={{ marginTop: 16, borderColor: colors.status.danger }}>
          <Text style={{ color: colors.status.danger, fontSize: 13 }}>{erro}</Text>
        </Card>
      )}

      <View style={styles.statsRow}>
        <StatPill icon="people-outline" value={carregando ? '—' : totalTurmas} label="Turmas" color={colors.accents.indigo} />
        <StatPill icon="book-outline" value={carregando ? '—' : totalMaterias} label="Matérias" color={colors.accents.cyan} />
        <StatPill icon="time-outline" value={carregando ? '—' : totalTurnos} label="Turnos" color={colors.accents.amber} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu</Text>
      <View style={styles.grid}>
        <MenuCard
          title="Turmas"
          subtitle="Gerenciar turmas"
          icon="people"
          gradient={[colors.accents.indigo, colors.accents.blue]}
          onPress={() => navigation.navigate('TurmasStack')}
        />
        <MenuCard
          title="Matérias"
          subtitle="Disciplinas"
          icon="book"
          gradient={[colors.accents.cyan, colors.accents.teal]}
          onPress={() => navigation.navigate('MateriasStack')}
        />
        <MenuCard
          title="Turnos"
          subtitle="Horários"
          icon="time"
          gradient={[colors.accents.amber, colors.accents.orange]}
          onPress={() => navigation.navigate('TurnosStack')}
        />
        <MenuCard
          title="Meu perfil"
          subtitle="Dados pessoais"
          icon="person"
          gradient={[colors.brand.purple, colors.accents.pink]}
          onPress={() => navigation.navigate('Perfil')}
        />
      </View>

      {minhasTurmas.length > 0 && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Minhas turmas</Text>
          </View>
          {minhasTurmas.map((t) => (
            <Card key={t.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.turmaNome, { color: colors.text }]}>{t.nome}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    Ano letivo {t.anoLetivo}
                  </Text>
                </View>
                {t.nomeTurno && <Badge label={t.nomeTurno} color={colors.accents.amber} />}
              </View>
            </Card>
          ))}
        </>
      )}
    </ScreenContainer>
  );
}
