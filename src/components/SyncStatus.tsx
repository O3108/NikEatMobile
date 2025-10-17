import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../contexts/StoreContext';

const SyncStatus = () => {
  const { isAccessEdit } = useStore();

  return (
    <View style={[styles.container, !isAccessEdit && styles.offline]}>
      <Ionicons
        name={isAccessEdit ? 'cloud-done' : 'cloud-offline'}
        size={16}
        color={isAccessEdit ? '#4caf50' : '#ff9500'}
      />
      <Text style={[styles.text, !isAccessEdit && styles.offlineText]}>
        {isAccessEdit ? 'Онлайн' : 'Офлайн'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    gap: 6,
  },
  offline: {
    backgroundColor: '#fff3e0',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  offlineText: {
    color: '#ff9500',
  },
});

export default SyncStatus;
