import { UserRole } from '../types/models';

export type AuthStackParamList = {
  Login: undefined;
  Register: { role?: UserRole } | undefined;
};

export type TurmasStackParamList = {
  TurmasList: undefined;
  TurmaForm: { id?: number } | undefined;
};

export type MateriasStackParamList = {
  MateriasList: undefined;
  MateriaForm: { id?: number } | undefined;
};

export type TurnosStackParamList = {
  TurnosList: undefined;
  TurnoForm: { id?: number } | undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
  TurmasStack: undefined;
  MateriasStack: undefined;
  TurnosStack: undefined;
  Perfil: undefined;
};

export type AlunoStackParamList = {
  AlunoDashboard: undefined;
  AlunoMaterias: undefined;
  AlunoMateriaDetalhe: { materiaId: number };
};
