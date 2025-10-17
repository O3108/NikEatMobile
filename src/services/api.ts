import { Product, Settings, ActiveInsulin, Glucose } from '../types';

// Замените на URL вашего сервера
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'GET',
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
    return data;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
  },

  async updateProducts(products: Product[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
  },

  async deleteProduct(product: Product): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
  },

  // Settings
  async getSettings(): Promise<Settings> {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'GET',
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
    return data;
  },

  async updateSettings(settings: Settings): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
  },

  // Active Insulin
  async getActiveInsulin(): Promise<ActiveInsulin> {
    const response = await fetch(`${API_BASE_URL}/api/active-insulin`, {
      method: 'GET',
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
    return data;
  },

  async updateActiveInsulin(activeInsulin: ActiveInsulin): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/active-insulin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeInsulin),
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
  },

  // Glucose
  async getGlucose(): Promise<Glucose> {
    const response = await fetch(`${API_BASE_URL}/api/glucose`, {
      method: 'GET',
    });
    const data = await response.json();
    if ('error' in data) throw new Error(data.error);
    return data;
  },
};
