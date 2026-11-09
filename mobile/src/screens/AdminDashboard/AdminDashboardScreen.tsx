import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { adminService } from '../../services/adminService';
import { common } from '../../styles/common';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { StatPill } from '../../components/StatPill';
import { ProgressBar } from '../../components/ProgressBar';

const pct = (parte: number, todo: number) => (todo ? Math.round((parte / todo) * 100) : 0);

/** Painel do administrador (web: /admin-dashboard → GET /api/admin/dashboard). */
export default function AdminDashboardScreen() {
  const { colors } = useAppTheme();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(adminService.dashboard);

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <Text style={[common.section, { color: colors.text, marginTop: 0 }]}>Acesso</Text>
            <View style={common.pills}>
              <StatPill icon="people-outline" value={dados.contas} label="Contas" color={colors.accents.blue} />
              <StatPill icon="ban-outline" value={dados.contasInativas} label="Inativas" color={colors.status.danger} />
              <StatPill icon="school-outline" value={dados.alunos} label="Alunos" color={colors.brand.green} />
              <StatPill icon="person-outline" value={dados.professores} label="Professores" color={colors.brand.purple} />
              <StatPill icon="briefcase-outline" value={dados.diretores} label="Diretores" color={colors.accents.orange} />
              <StatPill icon="shield-outline" value={dados.admins} label="Admins" color={colors.accents.blue} />
            </View>

            <Text style={[common.section, { color: colors.text }]}>Catálogo</Text>
            <View style={common.pills}>
              <StatPill icon="albums-outline" value={dados.turmas} label="Turmas" color={colors.accents.blue} />
              <StatPill icon="book-outline" value={dados.materias} label="Matérias" color={colors.brand.green} />
            </View>
            <Card style={common.card}>
              <View style={common.between}>
                <Text style={[common.title, { color: colors.text }]}>Conteúdos publicados</Text>
                <Text style={[common.title, { color: colors.brand.purple }]}>
                  {dados.conteudos - dados.conteudosDespublicados}/{dados.conteudos}
                </Text>
              </View>
              <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>{dados.conteudosDespublicados} fora do ar</Text>
              <ProgressBar percent={pct(dados.conteudos - dados.conteudosDespublicados, dados.conteudos)} color={colors.brand.deep} />
            </Card>
            <Card style={common.card}>
              <View style={common.between}>
                <Text style={[common.title, { color: colors.text }]}>Desafios publicados</Text>
                <Text style={[common.title, { color: colors.brand.purple }]}>
                  {dados.desafios - dados.desafiosDespublicados}/{dados.desafios}
                </Text>
              </View>
              <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>{dados.desafiosDespublicados} fora do ar</Text>
              <ProgressBar percent={pct(dados.desafios - dados.desafiosDespublicados, dados.desafios)} color={colors.brand.deep} />
            </Card>
            <View style={common.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
