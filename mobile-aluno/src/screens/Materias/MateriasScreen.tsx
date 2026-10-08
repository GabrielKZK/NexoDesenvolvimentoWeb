import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { listarMaterias } from "../../services/materiaApi";
import { brand } from "../../styles/theme";
import { useTheme } from "../../hooks/useTheme";
import { MateriaDTO } from "../../types/materia";
import { createStyles } from "./styles";
import { MateriasScreenProps } from "./types";

export default function MateriasScreen({
  onSelectMateria,
  onBack,
}: MateriasScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMaterias() {
      try {
        setLoading(true);
        setMaterias(await listarMaterias());
      } catch {
        setError("Não foi possível carregar as matérias.");
      } finally {
        setLoading(false);
      }
    }

    carregarMaterias();
  }, []);

  const filtradas = materias.filter((m) =>
    m.nome.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Minhas Matérias</Text>
      <Text style={styles.subtitle}>
        Explore todo o conteúdo disponível por disciplina
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar matéria..."
        placeholderTextColor={theme.textMuted}
        value={busca}
        onChangeText={setBusca}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      {loading && (
        <ActivityIndicator color={brand.purple} style={styles.loading} />
      )}

      <FlatList
        data={filtradas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>Nenhuma matéria encontrada.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>📚</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.segmento}>{item.segmento}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectMateria(item.id)}
            >
              <Text style={styles.buttonText}>Acessar Disciplina</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
