# Changelog

## [1.0.0] - 2025-10-17

### Добавлено
- ✅ Полная портация веб-приложения NikEat на React Native
- ✅ Калькулятор инсулина с расчетом дозы
- ✅ Управление продуктами (CRUD операции)
- ✅ Настройки доз инсулина
- ✅ Мониторинг глюкозы
- ✅ Синхронизация с сервером через REST API
- ✅ Офлайн режим с локальным хранением (AsyncStorage)
- ✅ Индикатор статуса подключения (Онлайн/Офлайн)
- ✅ Pull-to-refresh для обновления данных
- ✅ Утилиты для работы с датами и расчетами
- ✅ Контекстное управление состоянием (React Context)
- ✅ Система уведомлений (Alert)
- ✅ Bottom Tab Navigation
- ✅ TypeScript для типобезопасности

### Технологии
- React Native 0.81.4
- Expo ~54.0.13
- TypeScript ~5.9.2
- React Navigation 7.x
- AsyncStorage 2.2.0
- Expo Vector Icons 15.0.2

### Структура проекта
```
src/
├── components/      # Переиспользуемые компоненты
│   ├── Alert.tsx
│   ├── Loading.tsx
│   └── SyncStatus.tsx
├── contexts/        # React Context
│   ├── AlertContext.tsx
│   └── StoreContext.tsx
├── hooks/           # Custom hooks
│   └── useRefresh.ts
├── navigation/      # Навигация
│   └── AppNavigator.tsx
├── screens/         # Экраны
│   ├── CalculatorScreen.tsx
│   ├── ProductsScreen.tsx
│   ├── SettingsScreen.tsx
│   └── GlucoseScreen.tsx
├── services/        # API сервисы
│   └── api.ts
├── types/           # TypeScript типы
│   └── index.ts
└── utils/           # Утилиты
    ├── dateUtils.ts
    └── insulinUtils.ts
```

### API Endpoints
- `GET /api/products` - Получить продукты
- `PUT /api/products` - Создать продукт
- `PATCH /api/products` - Обновить продукты
- `DELETE /api/products` - Удалить продукт
- `GET /api/settings` - Получить настройки
- `PATCH /api/settings` - Обновить настройки
- `GET /api/active-insulin` - Получить активный инсулин
- `PATCH /api/active-insulin` - Обновить активный инсулин
- `GET /api/glucose` - Получить данные глюкозы

### Особенности
- **Автоматическая синхронизация** при запуске приложения
- **Разрешение конфликтов** для активного инсулина (по дате)
- **Graceful degradation** - работает без интернета
- **Оптимистичные обновления** - мгновенный UI feedback
- **Кеширование** - данные сохраняются локально

### Документация
- `README.md` - Основная документация
- `SETUP.md` - Инструкция по настройке
- `CHANGELOG.md` - История изменений

### Известные ограничения
- Требуется Node.js >= 20.19.4
- Синхронизация глюкозы только для чтения
- Офлайн изменения не синхронизируются автоматически

### Планы на будущее
- [ ] Автоматическая синхронизация при восстановлении связи
- [ ] Push-уведомления
- [ ] Графики и статистика
- [ ] Экспорт данных
- [ ] Темная тема
- [ ] Локализация
