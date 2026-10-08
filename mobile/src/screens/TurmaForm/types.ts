import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TurmasStackParamList } from '../../navigation/types';

export interface TurmaFormScreenProps {
  navigation: NativeStackNavigationProp<TurmasStackParamList, 'TurmaForm'>;
  route: RouteProp<TurmasStackParamList, 'TurmaForm'>;
}
