import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MateriasStackParamList } from '../../navigation/types';

export interface MateriasListScreenProps {
  navigation: NativeStackNavigationProp<MateriasStackParamList, 'MateriasList'>;
}
