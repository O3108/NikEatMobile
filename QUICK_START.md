# 🚀 Быстрый старт

## Установка и запуск

```bash
# 1. Установите зависимости
npm install

# 2. Настройте .env
cp .env.example .env
# Отредактируйте .env

# 3. Запустите приложение
npm start
```

## Основные команды

### Разработка

```bash
# Запуск
npm start

# С очисткой кеша
npm start -- --clear

# Проверка типов
npx tsc --noEmit
```

### Публикация (Expo Go)

```bash
# 1. Установите EAS CLI
npm install -g eas-cli

# 2. Войдите
eas login

# 3. Настройте
eas update:configure

# 4. Опубликуйте
eas update --branch production --message "Initial release"
```

### Standalone приложение

```bash
# iOS
eas device:create
eas build --profile preview --platform ios

# Android
eas build --profile preview --platform android
```

### Обновление

```bash
# Быстрое обновление (JS/TS)
eas update --branch production --message "Bug fixes"

# Полная пересборка (нативный код)
eas build --profile preview --platform ios
```

### Git

```bash
# Добавить и закоммитить
git add .
git commit -m "feat: Your changes"

# Push на GitHub
git push
```

## Документация

- **README.md** - Основная документация
- **SETUP.md** - Подробная установка
- **COMMANDS.md** - Все команды
- **FREE_INSTALL.md** - Бесплатная установка на устройства
- **STANDALONE_BUILD.md** - Создание standalone приложения
- **UPDATE_GUIDE.md** - Обновление приложения
- **TIMER_FEATURE.md** - Функция таймера

## Структура проекта

```
NikEatMobile/
├── src/
│   ├── components/      # Компоненты
│   ├── contexts/        # Context API
│   ├── hooks/           # Кастомные хуки
│   ├── navigation/      # Навигация
│   ├── screens/         # Экраны
│   ├── services/        # API сервисы
│   ├── types/           # TypeScript типы
│   └── utils/           # Утилиты
├── App.tsx              # Главный файл
└── package.json
```

## Быстрые ссылки

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
