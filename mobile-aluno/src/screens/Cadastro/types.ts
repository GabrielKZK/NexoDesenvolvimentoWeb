import { AlunoDTO } from "../../types/aluno";

export interface CadastroScreenProps {
  onCadastroSuccess: (aluno: AlunoDTO) => void;
  onGoToLogin: () => void;
}
