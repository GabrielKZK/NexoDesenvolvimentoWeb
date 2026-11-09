import { Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useConfiguracoes } from '../../hooks/useConfiguracoes';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { SwitchRow } from '../../components/SwitchRow';
import { styles } from './styles';

/** Configurações do aluno (web: /configuracoes). Gamificação e privacidade do ranking; gravadas em /api/configuracoes. */
export default function ConfiguracoesScreen() {
  const { colors } = useAppTheme();
  const { aluno, erroSync, atualizarAluno } = useConfiguracoes();

  return (
    <ScreenContainer>
      {erroSync && <Text style={[styles.erro, { color: colors.status.danger }]}>{erroSync}</Text>}

      <Text style={[styles.secao, { color: colors.text }]}>Gamificação</Text>
      <Card style={styles.card}>
        <SwitchRow
          label="Ranking da turma"
          description="Mostra o quadro de ranking no seu início."
          value={aluno.gamificacao.rankingTurma}
          onValueChange={(v) => atualizarAluno('gamificacao', { rankingTurma: v })}
        />
        <SwitchRow
          label="XP em tempo real"
          value={aluno.gamificacao.exibirXpTempoReal}
          onValueChange={(v) => atualizarAluno('gamificacao', { exibirXpTempoReal: v })}
        />
        <SwitchRow
          label="Animações de conquista"
          value={aluno.gamificacao.animacoesConquista}
          onValueChange={(v) => atualizarAluno('gamificacao', { animacoesConquista: v })}
        />
      </Card>

      <Text style={[styles.secao, { color: colors.text }]}>Privacidade</Text>
      <Card style={styles.card}>
        <SwitchRow
          label="Aparecer no ranking"
          description="Desligado, você não ganha posição nem aparece para os colegas."
          value={aluno.privacidade.exibirNoRanking}
          onValueChange={(v) => atualizarAluno('privacidade', { exibirNoRanking: v })}
        />
        <SwitchRow
          label="Perfil público"
          value={aluno.privacidade.perfilPublico}
          onValueChange={(v) => atualizarAluno('privacidade', { perfilPublico: v })}
        />
      </Card>
    </ScreenContainer>
  );
}
