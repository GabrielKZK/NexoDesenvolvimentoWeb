import { AlunoDTO } from "../../types/aluno";

export interface DashboardScreenProps {
  aluno: AlunoDTO;
  onAlunoChange: (aluno: AlunoDTO) => void;
  onLogout: () => void;
}
