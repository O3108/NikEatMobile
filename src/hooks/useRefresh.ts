import { useState, useCallback } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useAlert } from '../contexts/AlertContext';
import { api } from '../services/api';
import { parseDate } from '../utils/dateUtils';

export const useRefresh = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { setProducts, setSettings, setGlucose, setActiveInsulin, isAccessEdit } = useStore();
  const { setAlertData } = useAlert();

  const onRefresh = useCallback(async () => {
    if (!isAccessEdit) {
      setAlertData({ isShow: true, severity: 'info', message: 'Нет подключения к серверу' });
      return;
    }

    setRefreshing(true);
    try {
      const [serverProducts, serverSettings, serverGlucose, serverActiveInsulin] = await Promise.all([
        api.getProducts(),
        api.getSettings(),
        api.getGlucose(),
        api.getActiveInsulin(),
      ]);

      setProducts(serverProducts);
      setSettings(serverSettings);
      setActiveInsulin(serverActiveInsulin);

      // Вызываем calculateGlucose для обновления расчетов глюкозы
      if (serverGlucose) {
        api.calculateGlucose(serverGlucose)
          .then(calculateResponse => {
            setGlucose(calculateResponse);
          })
          .catch(error => {
            console.warn('Failed to calculate glucose:', error);
            setGlucose(serverGlucose); // Используем исходные данные при ошибке
          });
      } else {
        setGlucose(serverGlucose);
      }

      setAlertData({ isShow: true, severity: 'success', message: 'Данные обновлены' });
    } catch (error) {
      console.error('Error refreshing data:', error);
      setAlertData({ isShow: true, severity: 'error', message: 'Ошибка обновления' });
    } finally {
      setRefreshing(false);
    }
  }, [isAccessEdit, setProducts, setSettings, setGlucose, setActiveInsulin, setAlertData]);

  return { refreshing, onRefresh };
};
