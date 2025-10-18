import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useStore } from '../contexts/StoreContext';
import { useAlert } from '../contexts/AlertContext';
import { Product, Settings } from '../types';
import { api } from '../services/api';
import SyncStatus from '../components/SyncStatus';
import { useRefresh } from '../hooks/useRefresh';
import { formatDate, formatDuration } from '../utils/dateUtils';
import { parseNumber } from '../utils/numberUtils';
import { calculateActiveInsulin, getPassedTime, calculateInsulinDose } from '../utils/insulinUtils';

const CalculatorScreen = () => {
  const { products, settings, activeInsulin, setActiveInsulin, isAccessEdit } = useStore();
  const { setAlertData } = useAlert();
  const { refreshing, onRefresh } = useRefresh();

  const hours = new Date().getHours();
  const [selectedSettings, setSelectedSettings] = useState<keyof Settings>(
    hours > 6 && hours < 12 ? 'breakfast' : hours < 18 ? 'lunch' : 'dinner'
  );
  const [currentGlucose, setCurrentGlucose] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<(Product & { count: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((p) => !selectedProducts.find((sp) => sp.id === p.id))
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, selectedProducts, searchQuery]);

  const newActiveInsulin = calculateActiveInsulin(activeInsulin);
  const passedTime = getPassedTime(activeInsulin);

  const totalXE = useMemo(() => {
    return Math.round(
      selectedProducts.reduce((acc, curr) => acc + curr.value * curr.count, 0) * 10
    ) / 10;
  }, [selectedProducts]);

  const totalValue = useMemo(() => {
    const glucoseValue = parseNumber(currentGlucose);
    const settingValue = settings?.[selectedSettings] || 0;
    
    return calculateInsulinDose(totalXE, glucoseValue, settingValue, newActiveInsulin, passedTime);
  }, [totalXE, currentGlucose, selectedSettings, settings, newActiveInsulin, passedTime]);

  const addProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, { ...product, count: 1 }]);
    setSearchQuery('');
  };

  const updateProductCount = (index: number, count: string) => {
    const newProducts = [...selectedProducts];
    newProducts[index].count = parseNumber(count);
    setSelectedProducts(newProducts);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const dateStr = formatDate(now);
      
      const newInsulin = {
        id: activeInsulin?.id || 1,
        date: dateStr,
        value: totalValue,
      };
      
      // Синхронизация с сервером
      if (isAccessEdit) {
        await api.updateActiveInsulin(newInsulin);
      }
      
      setActiveInsulin(newInsulin);
      setSelectedProducts([]);
      setCurrentGlucose('');
      setAlertData({ isShow: true, severity: 'success', message: 'Данные сохранены' });
    } catch (error) {
      console.error('Error saving active insulin:', error);
      setAlertData({ isShow: true, severity: 'error', message: 'Ошибка сохранения' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Покушаем</Text>
        <SyncStatus />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Сахар</Text>
        <TextInput
          style={styles.input}
          value={currentGlucose}
          onChangeText={setCurrentGlucose}
          keyboardType="decimal-pad"
          placeholder="Введите уровень глюкозы"
        />
      </View>

      {activeInsulin && (
        <Text style={styles.activeInsulin}>
          Активный инсулин: {newActiveInsulin} 
          {passedTime > 0 && ` (прошло ${formatDuration(passedTime)})`}
        </Text>
      )}

      <View style={styles.settingsGroup}>
        <Text style={styles.label}>Прием пищи</Text>
        <View style={styles.settingsButtons}>
          <TouchableOpacity
            style={[styles.settingButton, selectedSettings === 'breakfast' && styles.settingButtonActive]}
            onPress={() => setSelectedSettings('breakfast')}
          >
            <Text style={[styles.settingButtonText, selectedSettings === 'breakfast' && styles.settingButtonTextActive]}>
              Завтрак
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingButton, selectedSettings === 'lunch' && styles.settingButtonActive]}
            onPress={() => setSelectedSettings('lunch')}
          >
            <Text style={[styles.settingButtonText, selectedSettings === 'lunch' && styles.settingButtonTextActive]}>
              Обед
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingButton, selectedSettings === 'dinner' && styles.settingButtonActive]}
            onPress={() => setSelectedSettings('dinner')}
          >
            <Text style={[styles.settingButtonText, selectedSettings === 'dinner' && styles.settingButtonTextActive]}>
              Ужин
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Добавить продукт</Text>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск продукта..."
        />
        {searchQuery.length > 0 && (
          <ScrollView style={styles.dropdown} nestedScrollEnabled>
            {filteredProducts.slice(0, 5).map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.dropdownItem}
                onPress={() => addProduct(product)}
              >
                <Text>{product.name} ({product.value} ХЕ)</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.selectedProducts}>
        {selectedProducts.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productValue}>{product.value} ХЕ</Text>
            </View>
            <View style={styles.productActions}>
              <TextInput
                style={styles.productInput}
                value={String(product.count)}
                onChangeText={(text) => updateProductCount(index, text)}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity onPress={() => removeProduct(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, (!totalValue || totalValue < 0 || isLoading) && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!totalValue || totalValue < 0 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {totalValue > 0
              ? `${totalXE > 0 ? `На ${totalXE} ХЕ ` : ''}Нужно поставить ${totalValue}`
              : 'Не нужно ставить'}
          </Text>
        )}
      </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  activeInsulin: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  settingsGroup: {
    marginBottom: 16,
  },
  settingsButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settingButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  settingButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  settingButtonText: {
    fontSize: 14,
    color: '#333',
  },
  settingButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedProducts: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productValue: {
    fontSize: 14,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalculatorScreen;
