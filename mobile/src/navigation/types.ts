export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
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
