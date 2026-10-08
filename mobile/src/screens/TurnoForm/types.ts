import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TurnosStackParamList } from '../../navigation/types';

export interface TurnoFormScreenProps {
  navigation: NativeStackNavigationProp<TurnosStackParamList, 'TurnoForm'>;
  route: RouteProp<TurnosStackParamList, 'TurnoForm'>;
}
