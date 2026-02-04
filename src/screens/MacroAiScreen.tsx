import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SyncStatus from '../components/SyncStatus';
import { fetchMacroInfo } from '../services/macroAi';
import { MacroInfo } from '../types';

const formatValue = (value: number | null) => {
  if (value === null || Number.isNaN(value)) {
    return '—';
  }
  return value % 1 === 0 ? value.toString() : value.toFixed(1);
};

const MacroAiScreen = () => {
  const [productName, setProductName] = useState('');
  const [macroInfo, setMacroInfo] = useState<MacroInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!productName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const info = await fetchMacroInfo(productName.trim());
      setMacroInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setMacroInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const showResult = Boolean(macroInfo) || Boolean(error);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>БЖУ ассистент</Text>
          <SyncStatus />
        </View>

        <Text style={styles.subtitle}>
          Введите продукт, и мы запросим Hugging Face Inference API ({process.env.EXPO_PUBLIC_HF_MODEL_ID}) для оценки БЖУ и калорий на 100 г.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Например, куриная грудка"
            value={productName}
            onChangeText={setProductName}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.button, (!productName.trim() || isLoading) && styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={!productName.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Получить БЖУ</Text>
            )}
          </TouchableOpacity>
        </View>

        {showResult && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Результат</Text>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              macroInfo && (
                <>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Белки</Text>
                    <Text style={styles.resultValue}>{formatValue(macroInfo.protein)} г</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Жиры</Text>
                    <Text style={styles.resultValue}>{formatValue(macroInfo.fat)} г</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Углеводы</Text>
                    <Text style={styles.resultValue}>{formatValue(macroInfo.carbs)} г</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Калории</Text>
                    <Text style={styles.resultValue}>{formatValue(macroInfo.calories)} ккал</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Порция</Text>
                    <Text style={styles.resultValue}>{formatValue(macroInfo.portionWeight)} г</Text>
                  </View>
                  {macroInfo.portionWeight && macroInfo.carbs &&
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>ХЕ на порцию</Text>
                      <Text style={styles.resultValue}>{formatValue((macroInfo.portionWeight / 100) * (macroInfo.carbs / 12))} г</Text>
                    </View>
                  }

                  {macroInfo.note && <Text style={styles.noteText}>{macroInfo.note}</Text>}
                  <Text style={styles.sourceText}>
                    Источник: {macroInfo.sourceModel ?? 'неизвестно'}
                  </Text>
                </>
              )
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c8ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  resultCard: {
    backgroundColor: '#e8f2ff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b4f9c',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a3d91',
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  sourceText: {
    fontSize: 12,
    color: '#888',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 15,
  },
});

export default MacroAiScreen;
