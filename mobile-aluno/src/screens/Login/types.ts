import { AlunoDTO } from "../../types/aluno";

export interface LoginScreenProps {
  onLoginSuccess: (aluno: AlunoDTO) => void;
  onGoToCadastro: () => void;
}
