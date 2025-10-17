import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAlert } from '../contexts/AlertContext';

const Alert = () => {
  const { alertData, hideAlert } = useAlert();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (alertData.isShow) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        hideAlert();
      });
    }
  }, [alertData.isShow]);

  if (!alertData.isShow) return null;

  const backgroundColor =
    alertData.severity === 'success'
      ? '#4caf50'
      : alertData.severity === 'error'
      ? '#f44336'
      : '#2196f3';

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity: fadeAnim },
      ]}
    >
      <Text style={styles.text}>
        {alertData.message || (alertData.severity === 'success' ? 'Успешно' : 'Ошибка')}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Alert;
