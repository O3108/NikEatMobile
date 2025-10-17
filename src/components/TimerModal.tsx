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
        // iOS - открываем приложение Часы с таймером
        const url = `clock-timer://timer?duration=${totalSeconds}`;
        const canOpen = await Linking.canOpenURL(url);
        
        if (canOpen) {
          await Linking.openURL(url);
          console.log('✅ Открыто приложение Часы (iOS)');
        } else {
          // Альтернативный способ для iOS
          await Linking.openURL('clock-timer://');
          console.log('✅ Открыто приложение Часы (iOS) - установите время вручную');
          Alert.alert(
            'Установите таймер',
            `Установите таймер на ${hours} ч ${minutes} мин в приложении Часы`,
            [{ text: 'OK' }]
          );
        }
      } else {
        // Android - открываем приложение Часы с таймером
        const url = `intent://timer/${totalSeconds}#Intent;scheme=android.intent.action.SET_TIMER;end`;
        
        try {
          await Linking.openURL(url);
          console.log('✅ Открыто приложение Часы (Android)');
        } catch (error) {
          // Альтернативный способ для Android
          await Linking.openURL('content://com.android.deskclock/timer');
          console.log('✅ Открыто приложение Часы (Android) - установите время вручную');
          Alert.alert(
            'Установите таймер',
            `Установите таймер на ${hours} ч ${minutes} мин в приложении Часы`,
            [{ text: 'OK' }]
          );
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
