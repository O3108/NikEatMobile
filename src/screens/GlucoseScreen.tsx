import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useStore } from '../contexts/StoreContext';
import SyncStatus from '../components/SyncStatus';
import { useRefresh } from '../hooks/useRefresh';
import { api } from '../services/api';
import { Glucose } from '../types';

interface GlucoseCardProps {
  title: string;
  avgValue: number;
  highCount: number;
  lowCount: number;
  date: string;
  onClearHigh: () => void;
  onClearLow: () => void;
  isLoading: boolean;
}

const GlucoseCard: React.FC<GlucoseCardProps> = ({ title, avgValue, highCount, lowCount, date, onClearHigh, onClearLow, isLoading }) => {
  const formatValue = (value: number) => {
    return value ? value.toFixed(1) : '—';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Средняя</Text>
          <Text style={styles.statValue}>{formatValue(avgValue)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Высокая</Text>
          <View style={styles.statWithButton}>
            <Text style={[styles.statValue, styles.highValue]}>
              {highCount}
            </Text>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={onClearHigh}
              disabled={isLoading || highCount === 0}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.clearButtonText}>✕</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Низкая</Text>
          <View style={styles.statWithButton}>
            <Text style={[styles.statValue, styles.lowValue]}>
              {lowCount}
            </Text>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={onClearLow}
              disabled={isLoading || lowCount === 0}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.clearButtonText}>✕</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.dateText}>Дата: {date}</Text>
    </View>
  );
};

const GlucoseScreen = () => {
  const { glucose, setGlucose } = useStore();
  const { refreshing, onRefresh } = useRefresh();
  const [isLoading, setIsLoading] = useState(false);

  const handleClearCount = async (period: 'day' | 'night' | 'allDay', type: 'high' | 'low') => {
    if (!glucose) return;

    Alert.alert(
      'Подтверждение',
      `Вы уверены, что хотите очистить ${type === 'high' ? 'высокую' : 'низкую'} глюкозу?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const updatedGlucose: Glucose = {
                ...glucose,
                [period]: {
                  ...glucose[period],
                  [type === 'high' ? 'highCount' : 'lowCount']: 0,
                },
              };
              await api.updateGlucose(updatedGlucose);
              setGlucose(updatedGlucose);
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось обновить данные');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Глюкоза</Text>
        <SyncStatus />
      </View>

      {glucose ? (
        <>
          <GlucoseCard
            title="Дневная глюкоза"
            avgValue={glucose.day.value}
            highCount={glucose.day.highCount}
            lowCount={glucose.day.lowCount}
            date={glucose.day.date}
            onClearHigh={() => handleClearCount('day', 'high')}
            onClearLow={() => handleClearCount('day', 'low')}
            isLoading={isLoading}
          />

          <GlucoseCard
            title="Ночная глюкоза"
            avgValue={glucose.night.value}
            highCount={glucose.night.highCount}
            lowCount={glucose.night.lowCount}
            date={glucose.night.date}
            onClearHigh={() => handleClearCount('night', 'high')}
            onClearLow={() => handleClearCount('night', 'low')}
            isLoading={isLoading}
          />

          {glucose.allDay && (
            <GlucoseCard
              title="Суточная глюкоза"
              avgValue={glucose.allDay.value}
              highCount={glucose.allDay.highCount}
              lowCount={glucose.allDay.lowCount}
              date={glucose.allDay.date}
              onClearHigh={() => handleClearCount('allDay', 'high')}
              onClearLow={() => handleClearCount('allDay', 'low')}
              isLoading={isLoading}
            />
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Целевые значения</Text>
            <Text style={styles.infoText}>• Нормальная глюкоза: 6.0 - 8.0 ммоль/л</Text>
            <Text style={styles.infoText}>• Высокая глюкоза: {'>'} 8.0 ммоль/л</Text>
            <Text style={styles.infoText}>• Низкая глюкоза: {'<'} 6.0 ммоль/л</Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Нет данных о глюкозе</Text>
          <Text style={styles.emptySubtext}>
            Данные будут отображаться после первого измерения
          </Text>
        </View>
      )}
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
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  highValue: {
    color: '#ff3b30',
  },
  lowValue: {
    color: '#ff9500',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  statWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default GlucoseScreen;
