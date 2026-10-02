import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/models';
import { Turma } from '../../types/models';
import { tema } from '../../theme/temaTurma';
import { turmaService } from '../../api/turmaService';

type Props = NativeStackScreenProps<RootStackParamList, 'ListagemTurmas'>;

export default function ListagemTurmasScreen({ navigation }: Props) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarTurmas();
    }, [])
  );

  // Olha como a função ficou muito mais limpa usando async/await e o seu service!
  const carregarTurmas = async () => {
    setLoading(true);
    try {
      const dados = await turmaService.listarTodas();
      setTurmas(dados);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tema.container}>
      <TouchableOpacity 
        style={tema.botaoNovaTurma} 
        onPress={() => navigation.navigate('CadastroTurma')}
      >
        <Text style={tema.textoBotao}>+ Nova Turma</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
      ) : turmas.length === 0 ? (
        <Text style={tema.textoVazio}>Nenhuma turma registrada ainda.</Text>
      ) : (
        <FlatList
          data={turmas}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={tema.cardTurma}
              onPress={() => navigation.navigate('DetalhesTurma', { turma: item })}
            >
              <View>
                <Text style={tema.nomeTurma}>{item.nome}</Text>
                <Text style={tema.infoTurma}>Ano Letivo: {item.anoLetivo}</Text>
              </View>
              <View style={tema.badgeOlho}>
                <Text style={tema.badgeText}>Ver</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}