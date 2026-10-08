import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MateriasStackParamList } from '../../navigation/types';

export interface MateriaFormScreenProps {
  navigation: NativeStackNavigationProp<MateriasStackParamList, 'MateriaForm'>;
  route: RouteProp<MateriasStackParamList, 'MateriaForm'>;
}
