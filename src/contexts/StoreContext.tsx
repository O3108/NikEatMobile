import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Settings, Glucose, ActiveInsulin } from '../types';
import Loading from '../components/Loading';
import { api } from '../services/api';

type StoreContextType = {
  settings: Partial<Settings> | null;
  setSettings: (settings: Partial<Settings>) => void;
  products: Product[] | null;
  setProducts: (products: Product[]) => void;
  glucose: Glucose | null;
  setGlucose: (value: Glucose) => void;
  activeInsulin: ActiveInsulin | null;
  setActiveInsulin: (value: ActiveInsulin) => void;
  isAccessEdit: boolean;
  isLoading: boolean;
};

const StoreContext = createContext<StoreContextType>({
  settings: null,
  setSettings: () => {},
  products: null,
  setProducts: () => {},
  glucose: null,
  setGlucose: () => {},
  activeInsulin: null,
  setActiveInsulin: () => {},
  isAccessEdit: true,
  isLoading: true,
});

export const useStore = () => useContext(StoreContext);

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [settings, setSettings] = useState<Partial<Settings> | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [glucose, setGlucose] = useState<Glucose | null>(null);
  const [activeInsulin, setActiveInsulin] = useState<ActiveInsulin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAccessEdit, setIsAccessEdit] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Сначала загружаем данные из AsyncStorage (офлайн режим)
        const storedProducts = await AsyncStorage.getItem('products');
        const storedSettings = await AsyncStorage.getItem('settings');
        const storedActiveInsulin = await AsyncStorage.getItem('activeInsulin');
        const storedGlucose = await AsyncStorage.getItem('glucose');

        if (storedProducts) setProducts(JSON.parse(storedProducts));
        if (storedSettings) setSettings(JSON.parse(storedSettings));
        if (storedActiveInsulin) setActiveInsulin(JSON.parse(storedActiveInsulin));
        if (storedGlucose) setGlucose(JSON.parse(storedGlucose));

        // Затем пытаемся синхронизировать с сервером
        try {
          const [serverProducts, serverSettings, serverGlucose, serverActiveInsulin] = await Promise.all([
            api.getProducts(),
            api.getSettings(),
            api.getGlucose(),
            api.getActiveInsulin(),
          ]);

          setProducts(serverProducts);
          setSettings(serverSettings);
          setGlucose(serverGlucose);
          
          // Вызываем calculateGlucose асинхронно (не блокируем загрузку)
          if (serverGlucose) {
            api.calculateGlucose(serverGlucose)
              .then(calculateResponse => {
                setGlucose(calculateResponse);
              })
              .catch(error => {
                console.warn('Failed to calculate glucose:', error);
                // Оставляем serverGlucose, который уже установлен
              });
          }

          // Проверяем, какой активный инсулин новее - локальный или серверный
          const localInsulin = storedActiveInsulin ? JSON.parse(storedActiveInsulin) : null;
          if (localInsulin && serverActiveInsulin) {
            const localDate = parseDate(localInsulin.date);
            const serverDate = parseDate(serverActiveInsulin.date);

            if (localDate > serverDate) {
              // Локальный новее - отправляем на сервер
              await api.updateActiveInsulin(localInsulin);
              setActiveInsulin(localInsulin);
            } else {
              // Серверный новее - используем его
              setActiveInsulin(serverActiveInsulin);
            }
          } else if (serverActiveInsulin) {
            setActiveInsulin(serverActiveInsulin);
          }

          setIsAccessEdit(true);
        } catch (apiError) {
          console.warn('API sync failed, using offline data:', apiError);
          setIsAccessEdit(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setIsAccessEdit(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const parseDate = (dateStr: string): Date => {
    // Формат: DD.MM.YY HH:mm
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('.');
    const [hours, minutes] = timePart.split(':');
    return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
  };

  // Сохранение данных при изменении
  useEffect(() => {
    if (products) AsyncStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (settings) AsyncStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (activeInsulin) AsyncStorage.setItem('activeInsulin', JSON.stringify(activeInsulin));
  }, [activeInsulin]);

  useEffect(() => {
    if (glucose) AsyncStorage.setItem('glucose', JSON.stringify(glucose));
  }, [glucose]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <StoreContext.Provider
      value={{
        settings,
        setSettings,
        products,
        setProducts,
        glucose,
        setGlucose,
        activeInsulin,
        setActiveInsulin,
        isAccessEdit,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
