import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Matérias
      </Text>

      <View style={styles.userContainer}>

        <View>
          <Text style={styles.name}>
            Gabriel Silva
          </Text>

          <Text style={styles.grade}>
            2º Ano - Ensino Médio
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            GS
          </Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
  },

  grade: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
