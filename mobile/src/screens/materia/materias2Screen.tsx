import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useEffect, useState } from 'react';

import Header from '../components/Header';

import { Parametros } from '../navigation/mavigation';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { RouteProp } from '@react-navigation/native';

import { listarMateriaPorId } from '../api/materiaApi';

import { Materia } from '../data/materia';

type NavigationProp = NativeStackNavigationProp<
  Parametros,
  'tela2'
>;

type RouteProps = RouteProp<
  Parametros,
  'tela2'
>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

export default function Materia2Screen({
  navigation,
  route,
}: Props) {

  const { id } = route.params;

  const [materia, setMateria] = useState<Materia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMateria();
  }, []);

  async function carregarMateria() {
    try {

      const dados = await listarMateriaPorId(id);

      setMateria(dados);

    } catch (error) {

      console.log(
        'Erro ao buscar matéria:',
        error
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo */}
      <View style={styles.content}>

        {/* Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('tela1')}
        >

          <Text style={styles.backIcon}>
            ‹
          </Text>

          <Text style={styles.backText}>
            Voltar para Matérias
          </Text>

        </TouchableOpacity>

        {/* Informações da matéria */}
        <View style={styles.materiaHeader}>

          {/* Ícone */}
          <View style={styles.iconContainer}>

            <Text style={styles.icon}>
              📚
            </Text>

          </View>

          {/* Textos */}
          <View style={styles.info}>

            {loading ? (

              <Text style={styles.title}>
                Carregando...
              </Text>

            ) : materia ? (

              <>
                <Text style={styles.title}>
                  {materia.nome}
                </Text>

                <View style={styles.details}>

                  <Text style={styles.aulas}>
                    {materia.segmento}
                  </Text>

                </View>
              </>

            ) : (

              <Text style={styles.title}>
                Matéria não encontrada
              </Text>

            )}

          </View>

        </View>

        {/* Progresso */}
        <View style={styles.progressCard}>

          <View style={styles.progressHeader}>

            <Text style={styles.progressTitle}>
              Progresso da Disciplina
            </Text>

            <Text style={styles.progressPercent}>
              0%
            </Text>

          </View>

          {/* Barra */}
          <View style={styles.progressBackground}>

            <View style={styles.progress} />

          </View>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    paddingHorizontal: 44,
    paddingTop: 24,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  backIcon: {
    fontSize: 28,
    color: '#0F172A',
    marginRight: 10,
  },

  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },

  materiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 114,
    height: 92,
    borderRadius: 16,
    backgroundColor: '#8B93A3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 48,
  },

  info: {
    marginLeft: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },

  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  aulas: {
    fontSize: 14,
    color: '#0F172A',
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 26,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressTitle: {
    fontSize: 14,
    color: '#1E3A5F',
  },

  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },

  progressBackground: {
    height: 12,
    backgroundColor: '#E9D5FF',
    borderRadius: 10,
    marginTop: 40,
    overflow: 'hidden',
  },

  progress: {
    width: '0%',
    height: '100%',
    backgroundColor: '#9333EA',
    borderRadius: 10,
  },

});
