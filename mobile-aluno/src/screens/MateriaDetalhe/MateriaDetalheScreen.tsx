import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { buscarMateria } from "../../services/materiaApi";
import { brand } from "../../styles/theme";
import { useTheme } from "../../hooks/useTheme";
import { MateriaDTO } from "../../types/materia";
import { createStyles } from "./styles";
import { MateriaDetalheScreenProps } from "./types";

export default function MateriaDetalheScreen({
  materiaId,
  onBack,
}: MateriaDetalheScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [materia, setMateria] = useState<MateriaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMateria() {
      try {
        setLoading(true);
        setMateria(await buscarMateria(materiaId));
      } catch {
        setError("Matéria não encontrada.");
      } finally {
        setLoading(false);
      }
    }

    carregarMateria();
  }, [materiaId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ Voltar para Matérias</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator color={brand.purple} style={styles.loading} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      {materia && (
        <View style={styles.header}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>📚</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{materia.nome}</Text>
            <Text style={styles.segmento}>{materia.segmento}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
