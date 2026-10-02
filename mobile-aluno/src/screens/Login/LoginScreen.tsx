import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginAluno, redefinirSenha } from "../../services/alunoApi";
import { brand } from "../../styles/theme";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "./styles";
import { LoginScreenProps } from "./types";

export default function LoginScreen({
  onLoginSuccess,
  onGoToCadastro,
}: LoginScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [emailInstitucional, setEmailInstitucional] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recuperarVisible, setRecuperarVisible] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [novaSenhaRecuperacao, setNovaSenhaRecuperacao] = useState("");
  const [recuperarErro, setRecuperarErro] = useState<string | null>(null);
  const [recuperarLoading, setRecuperarLoading] = useState(false);
  const [recuperarEnviado, setRecuperarEnviado] = useState(false);

  const abrirRecuperarSenha = () => {
    setEmailRecuperacao(emailInstitucional);
    setNovaSenhaRecuperacao("");
    setRecuperarErro(null);
    setRecuperarEnviado(false);
    setRecuperarVisible(true);
  };

  const fecharRecuperarSenha = () => {
    setRecuperarVisible(false);
  };

  const handleEnviarRecuperacao = async () => {
    if (!emailRecuperacao.trim()) {
      setRecuperarErro("Informe seu email institucional.");
      return;
    }
    if (novaSenhaRecuperacao.length < 8) {
      setRecuperarErro("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    try {
      setRecuperarLoading(true);
      setRecuperarErro(null);
      await redefinirSenha(emailRecuperacao, novaSenhaRecuperacao);
      setRecuperarEnviado(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setRecuperarErro("Não existe conta com esse email.");
      } else {
        setRecuperarErro("Não foi possível redefinir a senha. Tente novamente.");
      }
    } finally {
      setRecuperarLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!emailInstitucional.trim() || !senha.trim()) {
      setError("Informe email e senha.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const aluno = await loginAluno({ emailInstitucional, senha });
      onLoginSuccess(aluno);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Email ou senha inválidos.");
      } else {
        setError("Não foi possível fazer login. Verifique sua conexão.");
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
          <View style={styles.logoBadge}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

          <Text style={styles.label}>Email institucional</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailInstitucional}
            onChangeText={setEmailInstitucional}
          />
          <Text style={styles.helperText}>
            Nunca compartilharemos o seu login com ninguém.
          </Text>

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.inputLast}
            placeholder="Digite sua senha"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setMostrarSenha((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, mostrarSenha && styles.checkboxChecked]}>
                {mostrarSenha && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Mostrar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={abrirRecuperarSenha}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
            style={styles.submitButton}
          >
            <LinearGradient
              colors={[brand.purple, brand.green]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.submitGradient, { opacity: loading ? 0.6 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Entrar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToCadastro} style={styles.linkButton}>
            <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={recuperarVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharRecuperarSenha}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recuperar senha</Text>

            {recuperarEnviado ? (
              <Text style={styles.modalText}>
                Senha redefinida com sucesso! Já pode entrar com a nova senha.
              </Text>
            ) : (
              <>
                <Text style={styles.modalLabel}>
                  Informe seu email institucional e a nova senha.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@instituicao.edu"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={emailRecuperacao}
                  onChangeText={setEmailRecuperacao}
                />
                <TextInput
                  style={styles.inputLast}
                  placeholder="Nova senha (mínimo 8 caracteres)"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry
                  value={novaSenhaRecuperacao}
                  onChangeText={setNovaSenhaRecuperacao}
                />
                {recuperarErro && (
                  <Text style={styles.error}>{recuperarErro}</Text>
                )}
              </>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                onPress={fecharRecuperarSenha}
                style={styles.modalButtonOutline}
              >
                <Text style={styles.modalButtonOutlineText}>
                  {recuperarEnviado ? "Fechar" : "Cancelar"}
                </Text>
              </TouchableOpacity>

              {!recuperarEnviado && (
                <TouchableOpacity
                  onPress={handleEnviarRecuperacao}
                  disabled={recuperarLoading}
                  style={[
                    styles.modalButtonPrimary,
                    { opacity: recuperarLoading ? 0.6 : 1 },
                  ]}
                >
                  {recuperarLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonPrimaryText}>Redefinir</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
