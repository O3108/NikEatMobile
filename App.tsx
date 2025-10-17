import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { StoreProvider } from './src/contexts/StoreContext';
import { AlertProvider } from './src/contexts/AlertContext';
import AppNavigator from './src/navigation/AppNavigator';
import Alert from './src/components/Alert';

// Настройка поведения уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // Запрос разрешений при запуске
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StoreProvider>
        <AlertProvider>
          <AppNavigator />
          <Alert />
          <StatusBar style="auto" />
        </AlertProvider>
      </StoreProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
