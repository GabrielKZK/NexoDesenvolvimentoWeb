import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
}

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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padding: { padding: 20, paddingBottom: 40 },
});
