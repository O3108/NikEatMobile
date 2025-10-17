import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useStore } from '../contexts/StoreContext';
import { useAlert } from '../contexts/AlertContext';
import { Product } from '../types';
import { api } from '../services/api';
import SyncStatus from '../components/SyncStatus';
import { useRefresh } from '../hooks/useRefresh';

const ProductsScreen = () => {
  const { products, setProducts, isAccessEdit } = useStore();
  const { setAlertData } = useAlert();
  const { refreshing, onRefresh } = useRefresh();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const filteredProducts = products
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSave = async () => {
    if (!name.trim() || !value) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct) {
        // Обновление существующего продукта
        const updatedProduct: Product = {
          ...editingProduct,
          name: name.trim(),
          value: parseFloat(value),
        };
        
        if (isAccessEdit) {
          await api.updateProducts([updatedProduct]);
        }
        
        setProducts(products!.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
        setAlertData({ isShow: true, severity: 'success', message: 'Продукт обновлен' });
      } else {
        // Создание нового продукта
        const newProduct: Omit<Product, 'id'> = {
          name: name.trim(),
          value: parseFloat(value),
        };
        
        if (isAccessEdit) {
          await api.createProduct(newProduct);
          // Перезагружаем список продуктов с сервера
          const serverProducts = await api.getProducts();
          setProducts(serverProducts);
        } else {
          // Офлайн режим - используем временный ID
          const productWithId: Product = {
            ...newProduct,
            id: Date.now(),
          };
          setProducts([...(products || []), productWithId]);
        }
        
        setAlertData({ isShow: true, severity: 'success', message: 'Продукт добавлен' });
      }

      setName('');
      setValue('');
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      setAlertData({ isShow: true, severity: 'error', message: 'Ошибка сохранения' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setValue(String(product.value));
  };

  const handleDelete = (id: number) => {
    Alert.alert('Удаление', 'Вы уверены, что хотите удалить этот продукт?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            const productToDelete = products!.find((p) => p.id === id);
            if (productToDelete && isAccessEdit) {
              await api.deleteProduct(productToDelete);
            }
            setProducts(products!.filter((p) => p.id !== id));
            setAlertData({ isShow: true, severity: 'success', message: 'Продукт удален' });
          } catch (error) {
            console.error('Error deleting product:', error);
            setAlertData({ isShow: true, severity: 'error', message: 'Ошибка удаления' });
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    setName('');
    setValue('');
    setEditingProduct(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Продукты</Text>
        <SyncStatus />
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Название продукта"
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="ХЕ (хлебные единицы)"
          keyboardType="decimal-pad"
        />
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {editingProduct ? 'Обновить' : 'Добавить'}
              </Text>
            )}
          </TouchableOpacity>
          {editingProduct && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Поиск продуктов..."
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productValue}>{item.value} ХЕ</Text>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет продуктов</Text>
        }
      />
    </View>
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
  form: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
    marginBottom: 4,
  },
  productValue: {
    fontSize: 14,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
});

export default ProductsScreen;
