import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import { useEffect, useState } from 'react';

import Header from '../components/Header';
import Filters from '../components/Filters';
import Card from '../components/Cards';

import { listarMaterias } from '../api/materiaApi';
import { Materia } from '../data/materia';

export default function MateriasScreen({ navigation }: any) {

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMaterias();
  }, []);

  async function carregarMaterias() {
    try {
      const dados = await listarMaterias();

      setMaterias(dados);

    } catch (error) {
      console.log('Erro ao buscar matérias:', error);

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

        {/* Título */}
        <Text style={styles.title}>
          Minhas Matérias
        </Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          Explore todo o conteúdo disponível por disciplina
        </Text>

        {/* Filtros */}
        <Filters />

        {/* Lista */}
        <FlatList
          data={materias}
          keyExtractor={(item) => item.id.toString()}

          renderItem={({ item }) => (
            <Card
              materia={item}
              navigation={navigation}
            />
          )}

          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

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
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 6,
    marginBottom: 28,
  },

  list: {
    paddingBottom: 30,
  },
});
