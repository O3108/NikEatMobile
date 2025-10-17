import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StoreProvider } from './src/contexts/StoreContext';
import { AlertProvider } from './src/contexts/AlertContext';
import AppNavigator from './src/navigation/AppNavigator';
import Alert from './src/components/Alert';

export default function App() {
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
