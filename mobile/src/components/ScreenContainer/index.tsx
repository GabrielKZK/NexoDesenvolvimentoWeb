import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { ScreenContainerProps } from './types';

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scroll = true,
  padded = true,
  style,
  refreshing,
  onRefresh,
}) => {
  const { colors } = useAppTheme();

  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background }, padded && styles.padding, style]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={[padded && styles.padding, style]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.brand.purple} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};
