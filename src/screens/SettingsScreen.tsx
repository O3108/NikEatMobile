import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStore } from '../contexts/StoreContext';
import { useAlert } from '../contexts/AlertContext';
import { Settings } from '../types';
import { api } from '../services/api';
import SyncStatus from '../components/SyncStatus';

const SettingsScreen = () => {
  const { settings, setSettings, isAccessEdit } = useStore();
  const { setAlertData } = useAlert();
  const [formData, setFormData] = useState<Partial<Settings>>({
    longMorning: 0,
    longEvening: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof Settings, value: string) => {
    setFormData({
      ...formData,
      [field]: parseFloat(value) || 0,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = {
        ...formData,
        id: settings?.id || 1,
      } as Settings;

      if (isAccessEdit) {
        await api.updateSettings(settingsToSave);
      }
      
      setSettings(settingsToSave);
      setAlertData({ isShow: true, severity: 'success', message: 'Настройки сохранены' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setAlertData({ isShow: true, severity: 'error', message: 'Ошибка сохранения' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Настройки</Text>
        <SyncStatus />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Длинный инсулин</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Утро</Text>
          <TextInput
            style={styles.input}
            value={String(formData.longMorning || '')}
            onChangeText={(value) => handleChange('longMorning', value)}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Вечер</Text>
          <TextInput
            style={styles.input}
            value={String(formData.longEvening || '')}
            onChangeText={(value) => handleChange('longEvening', value)}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Короткий инсулин (на 1 ХЕ)</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Завтрак</Text>
          <TextInput
            style={styles.input}
            value={String(formData.breakfast || '')}
            onChangeText={(value) => handleChange('breakfast', value)}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Обед</Text>
          <TextInput
            style={styles.input}
            value={String(formData.lunch || '')}
            onChangeText={(value) => handleChange('lunch', value)}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ужин</Text>
          <TextInput
            style={styles.input}
            value={String(formData.dinner || '')}
            onChangeText={(value) => handleChange('dinner', value)}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Сохранить</Text>
        )}
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Справка</Text>
        <Text style={styles.infoText}>
          • Длинный инсулин - базальный инсулин, который вводится утром и вечером
        </Text>
        <Text style={styles.infoText}>
          • Короткий инсулин - болюсный инсулин на 1 хлебную единицу (ХЕ)
        </Text>
        <Text style={styles.infoText}>
          • 1 ХЕ = 10-12 г углеводов
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default SettingsScreen;
