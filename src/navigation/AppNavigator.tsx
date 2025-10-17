import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import CalculatorScreen from '../screens/CalculatorScreen';
import ProductsScreen from '../screens/ProductsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GlucoseScreen from '../screens/GlucoseScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Calculator') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Products') {
              iconName = focused ? 'fast-food' : 'fast-food-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Glucose') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{ tabBarLabel: 'Калькулятор' }}
        />
        <Tab.Screen
          name="Products"
          component={ProductsScreen}
          options={{ tabBarLabel: 'Продукты' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: 'Настройки' }}
        />
        <Tab.Screen
          name="Glucose"
          component={GlucoseScreen}
          options={{ tabBarLabel: 'Глюкоза' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
