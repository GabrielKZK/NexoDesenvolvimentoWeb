import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Filters() {
  return (
    <View style={styles.container}>

      <TextInput
        placeholder="Buscar matéria..."
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />

      <View style={styles.filter}>
        <Text style={styles.filterText}>
          Todos os Níveis
        </Text>

        <Text style={styles.arrow}>
          ▼
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 16,
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#0F172A',
  },

  filter: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  arrow: {
    fontSize: 10,
    color: '#64748B',
  },
});
