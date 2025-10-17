import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';

interface TimerModalProps {
  visible: boolean;
  onClose: () => void;
  insulinDose: number;
}

const TimerModal: React.FC<TimerModalProps> = ({ visible, onClose, insulinDose }) => {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(30);

  const adjustTime = (type: 'hours' | 'minutes', delta: number) => {
    if (type === 'hours') {
      const newHours = Math.max(0, Math.min(23, hours + delta));
      setHours(newHours);
    } else {
      let newMinutes = minutes + delta;
      if (newMinutes >= 60) {
        newMinutes = 0;
        setHours(Math.min(23, hours + 1));
      } else if (newMinutes < 0) {
        newMinutes = 45;
        setHours(Math.max(0, hours - 1));
      }
      setMinutes(newMinutes);
    }
  };

  const openSystemTimer = async () => {
    try {
      // Вычисляем время в секундах
      const totalSeconds = hours * 3600 + minutes * 60;
      console.log('Открытие системного таймера:', hours, 'ч', minutes, 'мин');
      console.log('Всего секунд:', totalSeconds);

      if (Platform.OS === 'ios') {
        // iOS - показываем инструкцию, так как прямое открытие не работает
        Alert.alert(
          '⏰ Установите таймер',
          `1. Откройте приложение "Часы"\n2. Перейдите на вкладку "Таймер"\n3. Установите ${hours} ч ${minutes} мин\n4. Нажмите "Начать"`,
          [
            {
              text: 'Отмена',
              style: 'cancel',
            },
            {
              text: 'Открыть Часы',
              onPress: async () => {
                try {
                  // Пробуем разные URL schemes для iOS
                  const urls = [
                    'clock-timer://',
                    'clock-alarm://',
                    'x-apple-clock://',
                  ];
                  
                  let opened = false;
                  for (const url of urls) {
                    try {
                      const canOpen = await Linking.canOpenURL(url);
                      if (canOpen) {
                        await Linking.openURL(url);
                        console.log('✅ Открыто приложение Часы (iOS):', url);
                        opened = true;
                        break;
                      }
                    } catch (e) {
                      console.log('Не удалось открыть:', url);
                    }
                  }
                  
                  if (!opened) {
                    Alert.alert(
                      'Откройте Часы вручную',
                      'Приложение "Часы" находится на главном экране iPhone'
                    );
                  }
                } catch (error) {
                  console.error('Ошибка:', error);
                }
              },
            },
          ]
        );
      } else {
        // Android - пробуем открыть с установленным временем
        try {
          // Способ 1: через Intent
          const intentUrl = `intent:#Intent;action=android.intent.action.SET_TIMER;i.android.intent.extra.alarm.LENGTH=${totalSeconds};i.android.intent.extra.alarm.SKIP_UI=true;end`;
          await Linking.openURL(intentUrl);
          console.log('✅ Таймер установлен (Android)');
        } catch (error) {
          console.log('Способ 1 не сработал, пробуем способ 2');
          
          try {
            // Способ 2: просто открываем приложение Часы
            await Linking.openURL('content://com.android.deskclock/timer');
            Alert.alert(
              'Установите таймер',
              `Установите таймер на ${hours} ч ${minutes} мин`,
              [{ text: 'OK' }]
            );
          } catch (error2) {
            Alert.alert(
              'Откройте Часы вручную',
              `Откройте приложение "Часы" и установите таймер на ${hours} ч ${minutes} мин`,
              [{ text: 'OK' }]
            );
          }
        }
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Ошибка открытия таймера:', error);
      Alert.alert(
        'Не удалось открыть таймер',
        `Откройте приложение Часы вручную и установите таймер на ${hours} ч ${minutes} мин`,
        [{ text: 'OK' }]
      );
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>⏰ Таймер</Text>
          <Text style={styles.subtitle}>
            Откроется системное приложение Часы с таймером
          </Text>

          <View style={styles.timeContainer}>
            {/* Часы */}
            <View style={styles.timeBlock}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => adjustTime('hours', 1)}
              >
                <Text style={styles.buttonText}>▲</Text>
              </TouchableOpacity>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeValue}>{hours}</Text>
                <Text style={styles.timeLabel}>ч</Text>
              </View>
              
              <TouchableOpacity
                style={styles.button}
                onPress={() => adjustTime('hours', -1)}
              >
                <Text style={styles.buttonText}>▼</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.separator}>:</Text>

            {/* Минуты */}
            <View style={styles.timeBlock}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => adjustTime('minutes', 15)}
              >
                <Text style={styles.buttonText}>▲</Text>
              </TouchableOpacity>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeValue}>{minutes}</Text>
                <Text style={styles.timeLabel}>мин</Text>
              </View>
              
              <TouchableOpacity
                style={styles.button}
                onPress={() => adjustTime('minutes', -15)}
              >
                <Text style={styles.buttonText}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={openSystemTimer}
            >
              <Text style={styles.confirmButtonText}>Открыть таймер</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timeBlock: {
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#333',
  },
  timeDisplay: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TimerModal;
