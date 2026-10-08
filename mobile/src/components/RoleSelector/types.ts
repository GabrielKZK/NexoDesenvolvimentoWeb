import { UserRole } from '../../types/models';

export interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}
