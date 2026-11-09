import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { useAppTheme } from './src/hooks/useAppTheme';
import { AuthProvider } from './src/context/AuthContext';
import { ConfiguracoesProvider } from './src/context/ConfiguracoesContext';
import { ChatProvider } from './src/context/ChatContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  const { isDark } = useAppTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuthProvider>
        <ConfiguracoesProvider>
          <ChatProvider>
            <RootNavigator />
          </ChatProvider>
        </ConfiguracoesProvider>
      </AuthProvider>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
