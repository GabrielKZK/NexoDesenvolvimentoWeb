import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function Card({ materia, navigation }) {

  return (
    <View style={styles.card}>

      {/* Cabeçalho */}
      <View style={styles.header}>

        {/* Ícone */}
        <View style={styles.icon}>
          <Text style={styles.iconText}>
            📚
          </Text>
        </View>

        {/* Informações */}
        <View style={styles.info}>

          <Text style={styles.name}>
            {materia.nome}
          </Text>

          <Text style={styles.level}>
            {materia.segmento}
          </Text>

        </View>

      </View>

      {/* Botão */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() =>
  navigation.navigate('tela2', {
    id: materia.id,
  })
}

      >
        <Text style={styles.buttonText}>
          Acessar Disciplina
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 8,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 64,
    height: 64,
    borderRadius: 15,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 28,
  },

  info: {
    marginLeft: 16,
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  level: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
  },

  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

});
