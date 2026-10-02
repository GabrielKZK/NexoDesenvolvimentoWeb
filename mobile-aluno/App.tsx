import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import CadastroScreen from "./src/screens/Cadastro/CadastroScreen";
import DashboardScreen from "./src/screens/Dashboard/DashboardScreen";
import LoginScreen from "./src/screens/Login/LoginScreen";
import { useTheme } from "./src/hooks/useTheme";
import { AlunoDTO } from "./src/types/aluno";

type Tela = "login" | "cadastro" | "dashboard";

export default function App() {
  const theme = useTheme();
  const [tela, setTela] = useState<Tela>("login");
  const [aluno, setAluno] = useState<AlunoDTO | null>(null);

  const handleLogout = () => {
    setAluno(null);
    setTela("login");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bgPrimary }]}
    >
      {tela === "login" && (
        <LoginScreen
          onLoginSuccess={(alunoLogado) => {
            setAluno(alunoLogado);
            setTela("dashboard");
          }}
          onGoToCadastro={() => setTela("cadastro")}
        />
      )}

      {tela === "cadastro" && (
        <CadastroScreen
          onCadastroSuccess={(alunoCriado) => {
            setAluno(alunoCriado);
            setTela("dashboard");
          }}
          onGoToLogin={() => setTela("login")}
        />
      )}

      {tela === "dashboard" && aluno && (
        <DashboardScreen
          aluno={aluno}
          onAlunoChange={setAluno}
          onLogout={handleLogout}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
