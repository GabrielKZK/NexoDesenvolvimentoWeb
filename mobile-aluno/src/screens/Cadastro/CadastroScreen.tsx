import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { cadastrarAluno } from "../../services/alunoApi";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "./styles";
import { CadastroScreenProps } from "./types";

export default function CadastroScreen({
  onCadastroSuccess,
  onGoToLogin,
}: CadastroScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [nome, setNome] = useState("");
  const [emailInstitucional, setEmailInstitucional] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCadastro = async () => {
    if (!nome.trim() || !emailInstitucional.trim() || !senha.trim()) {
      setError("Preencha nome, email e senha.");
      return;
    }
    if (senha.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const aluno = await cadastrarAluno({ nome, emailInstitucional, senha });
      onCadastroSuccess(aluno);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError("Dados inválidos. Confira os campos preenchidos.");
      } else {
        setError("Não foi possível cadastrar. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Junte-se ao Nexo e comece a estudar</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor={theme.textMuted}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Email institucional</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@instituicao.edu"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailInstitucional}
            onChangeText={setEmailInstitucional}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.inputLast}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <Text style={styles.helperText}>Use pelo menos 8 caracteres.</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            onPress={handleCadastro}
            disabled={loading}
            activeOpacity={0.9}
            style={[styles.submitButton, { opacity: loading ? 0.6 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToLogin} style={styles.linkButton}>
            <Text style={styles.linkText}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
