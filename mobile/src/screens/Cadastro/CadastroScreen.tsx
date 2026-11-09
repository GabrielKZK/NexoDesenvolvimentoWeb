import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../hooks/useAuth';
import { cadastroService } from '../../services/adminService';
import { MateriaDTO, TurmaDTO } from '../../types/api';
import { common } from '../../styles/common';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Segmented } from '../../components/Segmented';
import { ChipRow } from '../../components/ChipRow';
import { Chip } from '../../components/Chip';
import { styles } from './styles';

type Aba = 'aluno' | 'professor';
const MAX_MATERIAS = 3;

interface Acesso {
  login: string;
  senha: string;
  mensagem: string;
}

/** AAAA-MM-DD válido e dentro de 18–100 anos (mesma regra do ProfessorService; o servidor decide). */
function dataValida(texto: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const d = new Date(`${texto}T00:00:00`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== texto) return false;
  const hoje = new Date();
  const idade = hoje.getFullYear() - d.getFullYear() - (hoje < new Date(hoje.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return idade >= 18 && idade <= 100;
}

/**
 * Cadastro de aluno (diretor e admin) e de professor (só diretor — o backend recusa o admin).
 * Login e senha provisória nascem no servidor e aparecem uma única vez: aqui só se exibe e copia.
 */
export default function CadastroScreen() {
  const { colors } = useAppTheme();
  const { usuario } = useAuth();
  const podeProfessor = usuario?.role === 'diretor';

  const [aba, setAba] = useState<Aba>('aluno');
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [acesso, setAcesso] = useState<Acesso | null>(null);

  const [nomeAluno, setNomeAluno] = useState('');
  const [turmaId, setTurmaId] = useState<number | null>(null);

  const [nomeProf, setNomeProf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [sexo, setSexo] = useState<string | null>(null);
  const [materiaIds, setMateriaIds] = useState<number[]>([]);

  useEffect(() => {
    cadastroService.turmas().then(setTurmas).catch(() => undefined);
    if (podeProfessor) cadastroService.materias().then(setMaterias).catch(() => undefined);
  }, [podeProfessor]);

  const trocarAba = (nova: Aba) => {
    setAba(nova);
    setErro(null);
    setAcesso(null);
  };

  const alternarMateria = (id: number) =>
    setMateriaIds((atual) =>
      atual.includes(id) ? atual.filter((m) => m !== id) : atual.length >= MAX_MATERIAS ? atual : [...atual, id],
    );

  const alunoOk = nomeAluno.trim().length >= 3 && turmaId !== null;
  const professorOk = nomeProf.trim().length >= 3 && dataValida(nascimento) && !!sexo && materiaIds.length > 0;

  const cadastrar = async () => {
    setErro(null);
    setAcesso(null);
    setEnviando(true);
    try {
      if (aba === 'aluno') {
        const criado = await cadastroService.cadastrarAluno({ nome: nomeAluno.trim(), turmaId });
        setAcesso({ login: criado.emailInstitucional, senha: criado.senhaProvisoria, mensagem: `Aluno ${criado.nome} cadastrado.` });
        setNomeAluno('');
        setTurmaId(null);
      } else {
        const criado = await cadastroService.cadastrarProfessor({
          nome: nomeProf.trim(),
          dataNascimento: nascimento,
          sexo: sexo ?? '',
          materiaIds,
        });
        setAcesso({
          login: criado.emailInstitucional,
          senha: criado.senhaProvisoria,
          mensagem: `Professor ${criado.nome} cadastrado em ${criado.disciplinas}.`,
        });
        setNomeProf('');
        setNascimento('');
        setSexo(null);
        setMateriaIds([]);
      }
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível concluir o cadastro.'));
    } finally {
      setEnviando(false);
    }
  };

  const copiar = async () => {
    if (!acesso) return;
    await Clipboard.setStringAsync(`Login: ${acesso.login}\nSenha provisória: ${acesso.senha}`);
    Alert.alert('Copiado', 'Login e senha provisória copiados.');
  };

  return (
    <KeyboardAvoidingView style={common.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[common.flex, { backgroundColor: colors.background }]} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        {podeProfessor && (
          <Segmented
            valor={aba}
            onChange={trocarAba}
            opcoes={[
              { valor: 'aluno', rotulo: 'Aluno' },
              { valor: 'professor', rotulo: 'Professor' },
            ]}
          />
        )}

        {aba === 'aluno' ? (
          <>
            <Input label="Nome completo" value={nomeAluno} onChangeText={setNomeAluno} placeholder="Nome do aluno" autoCapitalize="words" />
            <Text style={[styles.rotulo, { color: colors.textSecondary }]}>Turma</Text>
            <ChipRow valor={turmaId} onChange={setTurmaId} opcoes={turmas.map((t) => ({ valor: t.id, rotulo: t.nome }))} />
          </>
        ) : (
          <>
            <Input label="Nome completo" value={nomeProf} onChangeText={setNomeProf} placeholder="Nome do professor" autoCapitalize="words" />
            <Input
              label="Data de nascimento (AAAA-MM-DD)"
              value={nascimento}
              onChangeText={setNascimento}
              placeholder="1985-03-21"
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              error={nascimento.length === 10 && !dataValida(nascimento) ? 'Data inválida (o professor precisa ter de 18 a 100 anos).' : null}
            />
            <Text style={[styles.rotulo, { color: colors.textSecondary }]}>Sexo</Text>
            <ChipRow
              valor={sexo}
              onChange={setSexo}
              opcoes={[
                { valor: 'M', rotulo: 'Masculino' },
                { valor: 'F', rotulo: 'Feminino' },
                { valor: 'N', rotulo: 'Não informar' },
              ]}
            />
            <Text style={[styles.rotulo, { color: colors.textSecondary }]}>
              Matérias (até {MAX_MATERIAS}) — {materiaIds.length} selecionada(s)
            </Text>
            <View style={styles.chips}>
              {materias.map((m) => (
                <Chip key={m.id} label={m.nome} selected={materiaIds.includes(m.id)} onPress={() => alternarMateria(m.id)} />
              ))}
            </View>
          </>
        )}

        {erro && <Text style={[common.msg, { color: colors.status.danger }]}>{erro}</Text>}
        <Button
          title={aba === 'aluno' ? 'Cadastrar aluno' : 'Cadastrar professor'}
          icon="person-add-outline"
          onPress={cadastrar}
          loading={enviando}
          disabled={enviando || (aba === 'aluno' ? !alunoOk : !professorOk)}
        />

        {acesso && (
          <Card style={{ marginTop: 20 }}>
            <Text style={[common.title, { color: colors.brand.green }]}>{acesso.mensagem}</Text>
            <Text style={[common.sub, { color: colors.textSecondary, marginTop: 8 }]}>Login</Text>
            <Text selectable style={[common.title, { color: colors.text }]}>
              {acesso.login}
            </Text>
            <Text style={[common.sub, { color: colors.textSecondary, marginTop: 8 }]}>Senha provisória</Text>
            <Text selectable style={[styles.senha, { color: colors.text }]}>
              {acesso.senha}
            </Text>
            <Text style={[common.sub, { color: colors.status.warning, marginVertical: 10 }]}>
              Esta senha aparece só agora. Copie e entregue à pessoa; no primeiro acesso ela será obrigada a trocá-la.
            </Text>
            <Button title="Copiar acesso" icon="copy-outline" variant="outline" onPress={copiar} />
          </Card>
        )}
        <View style={common.fim} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
