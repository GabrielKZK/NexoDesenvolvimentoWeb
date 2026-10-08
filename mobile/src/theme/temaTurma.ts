import { StyleSheet } from 'react-native';

export const cores = {
  fundo: '#0F172A',
  card: '#1E293B',
  textoBase: '#FFFFFF',
  textoSecundario: '#9CA3AF',
  verde: '#10B981',
  azul: '#3B82F6',
  vermelho: '#EF4444',
  cinza: '#6B7280',
  borda: '#334155'
};

export const tema = StyleSheet.create({
  // Fundo padrão
  container: { flex: 1, padding: 24, backgroundColor: cores.fundo },
  
  // Textos
  label: { color: cores.textoSecundario, fontSize: 14, marginBottom: 8, fontWeight: '600' },
  valor: { color: cores.textoBase, fontSize: 18, marginBottom: 16, fontWeight: 'bold' },
  textoVazio: { color: cores.textoSecundario, fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  
  // Inputs e Formulários
  formCard: { backgroundColor: cores.card, padding: 20, borderRadius: 16 },
  input: { backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.borda, borderRadius: 8, padding: 12, color: cores.textoBase, marginBottom: 16, fontSize: 16 },
  
  // Listagem (Card da Turma)
  cardTurma: { backgroundColor: cores.card, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: cores.azul },
  nomeTurma: { fontWeight: 'bold', fontSize: 18, color: cores.textoBase, marginBottom: 4 },
  infoTurma: { fontSize: 14, color: cores.textoSecundario },
  
  // Detalhes (Card normal)
  card: { backgroundColor: cores.card, padding: 20, borderRadius: 12, marginBottom: 20 },
  
  // Badges
  badgeOlho: { backgroundColor: cores.borda, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  badgeText: { color: '#D1D5DB', fontSize: 12, fontWeight: 'bold' },
  
  // Botões
  botaoPrincipal: { backgroundColor: cores.verde, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  botaoNovaTurma: { backgroundColor: cores.verde, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  textoBotao: { color: cores.textoBase, fontSize: 16, fontWeight: 'bold' },
  
  // Grupo de Botões (Tela de Detalhes)
  botoesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  botao: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  botaoEditar: { backgroundColor: cores.azul },
  botaoExcluir: { backgroundColor: cores.vermelho },
  botaoSalvar: { backgroundColor: cores.verde },
  botaoCancelar: { backgroundColor: cores.cinza }
});