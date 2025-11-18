import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useStore } from '../contexts/StoreContext';
import SyncStatus from '../components/SyncStatus';
import { useRefresh } from '../hooks/useRefresh';

interface GlucoseCardProps {
  title: string;
  avgValue: number;
  highCount: number;
  lowCount: number;
  date: string;
}

const GlucoseCard: React.FC<GlucoseCardProps> = ({ title, avgValue, highCount, lowCount, date }) => {
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
          <Text style={[styles.statValue, styles.highValue]}>
            {highCount}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Низкая</Text>
          <Text style={[styles.statValue, styles.lowValue]}>
            {lowCount}
          </Text>
        </View>
      </View>
      <Text style={styles.dateText}>Дата: {date}</Text>
    </View>
  );
};

const GlucoseScreen = () => {
  const { glucose } = useStore();
  const { refreshing, onRefresh } = useRefresh();

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
          />

          <GlucoseCard
            title="Ночная глюкоза"
            avgValue={glucose.night.value}
            highCount={glucose.night.highCount}
            lowCount={glucose.night.lowCount}
            date={glucose.night.date}
          />

          {glucose.allDay && (
            <GlucoseCard
              title="Суточная глюкоза"
              avgValue={glucose.allDay.value}
              highCount={glucose.allDay.highCount}
              lowCount={glucose.allDay.lowCount}
              date={glucose.allDay.date}
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
