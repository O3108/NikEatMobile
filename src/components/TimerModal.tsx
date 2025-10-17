import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';

interface TimerModalProps {
  visible: boolean;
  onClose: () => void;
  insulinDose: number;
}

// Глобальная переменная для хранения ID последнего таймера
let lastNotificationId: string | null = null;

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

  const scheduleNotification = async () => {
    try {
      // Запрос разрешений
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Необходимо разрешение на уведомления');
        return;
      }

      // Отменяем предыдущий таймер, если он был
      if (lastNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(lastNotificationId);
        console.log('Предыдущий таймер отменен:', lastNotificationId);
      }

      // Вычисляем время в секундах
      const totalSeconds = hours * 3600 + minutes * 60;

      // Планируем новое уведомление
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Время проверить глюкозу!',
          body: `Прошло ${hours} ч ${minutes} мин после инъекции ${insulinDose} ед инсулина`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger: { seconds: totalSeconds } as any,
      });

      // Сохраняем ID нового таймера
      lastNotificationId = notificationId;
      console.log('Новый таймер установлен:', notificationId);

      alert(`Таймер установлен на ${hours} ч ${minutes} мин`);
      onClose();
    } catch (error) {
      console.error('Error scheduling notification:', error);
      alert('Ошибка установки таймера');
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
          <Text style={styles.title}>Установить таймер</Text>
          <Text style={styles.subtitle}>
            Напомнить проверить глюкозу через:
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
              onPress={scheduleNotification}
            >
              <Text style={styles.confirmButtonText}>Установить</Text>
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
