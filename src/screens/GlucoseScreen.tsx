import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useStore } from '../contexts/StoreContext';
import SyncStatus from '../components/SyncStatus';
import { useRefresh } from '../hooks/useRefresh';

const GlucoseScreen = () => {
  const { glucose } = useStore();
  const { refreshing, onRefresh } = useRefresh();

  const formatValue = (value: number) => {
    return value ? value.toFixed(1) : '—';
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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Дневная глюкоза</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Средняя</Text>
                <Text style={styles.statValue}>{formatValue(glucose.day.value)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Высокая</Text>
                <Text style={[styles.statValue, styles.highValue]}>
                  {glucose.day.highCount}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Низкая</Text>
                <Text style={[styles.statValue, styles.lowValue]}>
                  {glucose.day.lowCount}
                </Text>
              </View>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Всего измерений:</Text>
              <Text style={styles.totalValue}>{glucose.day.totalGlucose}</Text>
            </View>
            <Text style={styles.dateText}>Дата: {glucose.day.date}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ночная глюкоза</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Средняя</Text>
                <Text style={styles.statValue}>{formatValue(glucose.night.value)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Высокая</Text>
                <Text style={[styles.statValue, styles.highValue]}>
                  {glucose.night.highCount}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Низкая</Text>
                <Text style={[styles.statValue, styles.lowValue]}>
                  {glucose.night.lowCount}
                </Text>
              </View>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Всего измерений:</Text>
              <Text style={styles.totalValue}>{glucose.night.totalGlucose}</Text>
            </View>
            <Text style={styles.dateText}>Дата: {glucose.night.date}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Целевые значения</Text>
            <Text style={styles.infoText}>• Нормальная глюкоза: 4.0 - 7.0 ммоль/л</Text>
            <Text style={styles.infoText}>• Высокая глюкоза: {'>'} 7.0 ммоль/л</Text>
            <Text style={styles.infoText}>• Низкая глюкоза: {'<'} 4.0 ммоль/л</Text>
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
