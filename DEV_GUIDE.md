# Developer Guide

## Быстрый старт для разработки

### Запуск приложения

```bash
# Установка зависимостей
npm install

# Запуск с правильной версией Node.js
source ~/.nvm/nvm.sh && nvm use 20.19.5 && npm start

# Запуск с очисткой кеша
npm start -- --clear
```

### Структура кода

#### Добавление нового экрана

1. Создайте файл в `src/screens/`:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NewScreen = () => {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default NewScreen;
```

2. Добавьте в навигацию (`src/navigation/AppNavigator.tsx`):
```typescript
<Tab.Screen
  name="NewScreen"
  component={NewScreen}
  options={{ tabBarLabel: 'Новый' }}
/>
```

#### Работа с API

Все API вызовы через `src/services/api.ts`:

```typescript
import { api } from '../services/api';

// Получить данные
const data = await api.getProducts();

// Создать
await api.createProduct({ name: 'Test', value: 1 });

// Обновить
await api.updateProducts([product]);

// Удалить
await api.deleteProduct(product);
```

#### Использование контекста

```typescript
import { useStore } from '../contexts/StoreContext';
import { useAlert } from '../contexts/AlertContext';

const MyComponent = () => {
  const { products, setProducts, isAccessEdit } = useStore();
  const { setAlertData } = useAlert();

  const handleSave = () => {
    setAlertData({ 
      isShow: true, 
      severity: 'success', 
      message: 'Сохранено' 
    });
  };
};
```

#### Утилиты

```typescript
import { formatDate, parseDate, formatDuration } from '../utils/dateUtils';
import { calculateActiveInsulin, calculateInsulinDose } from '../utils/insulinUtils';

// Форматирование даты
const dateStr = formatDate(new Date()); // "17.10.25 16:30"

// Парсинг даты
const date = parseDate("17.10.25 16:30");

// Форматирование длительности
const duration = formatDuration(125); // "2 ч 5 мин"

// Расчет активного инсулина
const active = calculateActiveInsulin(activeInsulin);

// Расчет дозы
const dose = calculateInsulinDose(totalXE, glucose, setting, active, time);
```

### Отладка

#### Просмотр логов

```bash
# Expo logs
npx expo start

# React Native logs
npx react-native log-ios
npx react-native log-android
```

#### Debugging в Chrome

1. Откройте приложение в Expo Go
2. Встряхните устройство
3. Выберите "Debug Remote JS"
4. Откройте Chrome DevTools

#### React DevTools

```bash
npm install -g react-devtools
react-devtools
```

### Тестирование

#### Тестирование API

```bash
# Проверка доступности API
curl https://your-api-url.com/api/products

# Тестирование локально
curl http://localhost:3000/api/products
```

#### Тестирование на устройстве

1. **iOS Simulator**:
   - Нажмите `i` в терминале
   - Или: `npx expo run:ios`

2. **Android Emulator**:
   - Нажмите `a` в терминале
   - Или: `npx expo run:android`

3. **Физическое устройство**:
   - Установите Expo Go
   - Отсканируйте QR-код

### Типичные проблемы

#### Ошибка "Metro bundler"

```bash
# Очистите кеш
npm start -- --clear

# Или
rm -rf node_modules/.cache
```

#### Ошибка "Unable to resolve module"

```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

#### Проблемы с AsyncStorage

```typescript
// Очистка данных
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.clear();
```

#### API не отвечает

1. Проверьте `.env` файл
2. Убедитесь, что сервер запущен
3. Проверьте URL (http vs https)
4. На физическом устройстве используйте IP вместо localhost

### Best Practices

#### Стиль кода

```typescript
// ✅ Хорошо
const MyComponent = () => {
  const [state, setState] = useState<string>('');
  
  const handlePress = useCallback(() => {
    setState('new value');
  }, []);

  return <View />;
};

// ❌ Плохо
function MyComponent() {
  var state = useState('');
  
  return <View />;
}
```

#### Управление состоянием

```typescript
// ✅ Используйте контекст для глобального состояния
const { products } = useStore();

// ✅ Используйте локальное состояние для UI
const [isOpen, setIsOpen] = useState(false);

// ❌ Не дублируйте данные из контекста
const [products, setProducts] = useState(storeProducts);
```

#### Обработка ошибок

```typescript
// ✅ Хорошо
try {
  await api.saveData(data);
  setAlertData({ isShow: true, severity: 'success' });
} catch (error) {
  console.error('Error:', error);
  setAlertData({ isShow: true, severity: 'error' });
}

// ❌ Плохо
await api.saveData(data); // Без обработки ошибок
```

### Полезные команды

```bash
# Проверка типов TypeScript
npx tsc --noEmit

# Форматирование кода (если настроен prettier)
npm run format

# Сборка для production
npx expo build:ios
npx expo build:android

# Обновление Expo
npx expo upgrade

# Установка новой зависимости
npm install package-name

# Просмотр размера bundle
npx expo export --dump-sourcemap
```

### Ресурсы

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Контакты

Для вопросов и предложений создавайте Issues в репозитории.
