# Полезные команды

## Запуск приложения

```bash
# Обычный запуск
npm start

# С правильной версией Node.js
source ~/.nvm/nvm.sh && nvm use 20.19.5 && npm start

# С очисткой кеша
npm start -- --clear

# С туннелем (если проблемы с подключением)
npm start -- --tunnel
```

## EAS Build (Standalone приложение)

### Основные команды

```bash
# Установка EAS CLI
npm install -g eas-cli

# Вход в аккаунт
eas login

# Регистрация устройства (iOS)
eas device:create

# Список устройств
eas device:list

# Preview build (для установки на устройства)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production build (для App Store / Google Play)
eas build --profile production --platform ios
eas build --profile production --platform android

# Список сборок
eas build:list

# Просмотр конкретной сборки
eas build:view [BUILD_ID]

# Отправка в App Store / Google Play
eas submit --platform ios
eas submit --platform android
```

### EAS Update (обновление без пересборки)

```bash
# Настройка updates (один раз)
eas update:configure

# Публикация обновления (основная команда)
eas update --branch production --message "Bug fixes"
eas update --branch development --message "New feature"
eas update --branch staging --message "QA testing"

# Список обновлений
eas update:list
eas update:list --branch production

# Просмотр обновления
eas update:view [UPDATE_ID]

# Откат к предыдущей версии
eas update --branch production --message "Rollback" --republish [UPDATE_ID]

# Список веток
eas branch:list

# Удаление обновления
eas update:delete [UPDATE_ID]
```

### Быстрое обновление после изменений

```bash
# Полный цикл: commit + update + push
git add . && git commit -m "feat: Changes" && eas update --branch production --message "Changes" && git push

# Только update
eas update --branch production --message "Your changes"
```

## Разработка

```bash
# Установка зависимостей
npm install

# Проверка типов TypeScript
npx tsc --noEmit

# Обновление Expo
npx expo upgrade

# Установка новой зависимости
npm install package-name

# Удаление зависимости
npm uninstall package-name
```

## Отладка

```bash
# Просмотр логов
npx expo start

# React Native logs (iOS)
npx react-native log-ios

# React Native logs (Android)
npx react-native log-android

# Открыть React DevTools
npx react-devtools
```

## Очистка

```bash
# Очистка кеша Metro
npm start -- --clear

# Очистка node_modules
rm -rf node_modules package-lock.json
npm install

# Очистка кеша Expo
rm -rf .expo

# Полная очистка
rm -rf node_modules package-lock.json .expo
npm install
```

## Prebuild (нативные проекты)

```bash
# Создание нативных проектов
npx expo prebuild

# Только iOS
npx expo prebuild --platform ios

# Только Android
npx expo prebuild --platform android

# Очистка нативных проектов
npx expo prebuild --clean
```

## Запуск на устройствах

```bash
# iOS симулятор
npm start
# Затем нажмите 'i'

# Android эмулятор
npm start
# Затем нажмите 'a'

# Web браузер
npm start
# Затем нажмите 'w'

# Запуск на конкретном устройстве
npx expo run:ios --device
npx expo run:android --device
```

## Git

```bash
# Инициализация репозитория
git init
git add .
git commit -m "Initial commit"

# Добавление remote
git remote add origin https://github.com/username/nikeat-mobile.git
git push -u origin main

# Обновление
git add .
git commit -m "Update"
git push
```

## Проверка окружения

```bash
# Версия Node.js
node --version

# Версия npm
npm --version

# Версия Expo CLI
npx expo --version

# Версия EAS CLI
eas --version

# Информация о проекте
npx expo config

# Проверка зависимостей
npm list
```

## Тестирование API

```bash
# Проверка доступности API
curl https://nik-eat-web.vercel.app/api/products

# Получение продуктов
curl https://nik-eat-web.vercel.app/api/products

# Получение настроек
curl https://nik-eat-web.vercel.app/api/settings

# Получение активного инсулина
curl https://nik-eat-web.vercel.app/api/active-insulin

# Получение глюкозы
curl https://nik-eat-web.vercel.app/api/glucose
```

## Полезные алиасы

Добавьте в `~/.zshrc` или `~/.bashrc`:

```bash
# Запуск приложения
alias nikeat-start="source ~/.nvm/nvm.sh && nvm use 20.19.5 && npm start"
alias nikeat-clean="npm start -- --clear"

# Standalone build
alias nikeat-build-ios="eas build --profile preview --platform ios"
alias nikeat-build-android="eas build --profile preview --platform android"

# Обновления
alias nikeat-update="eas update --branch production --message"
alias nikeat-update-dev="eas update --branch development --message"

# Регистрация устройства
alias nikeat-device="eas device:create"

# Список сборок
alias nikeat-builds="eas build:list"
```

Затем используйте:
```bash
nikeat-start
nikeat-clean
nikeat-build-ios
nikeat-build-android
nikeat-update "Bug fixes"
nikeat-device
```

## Быстрые команды для разных задач

### Первый запуск проекта
```bash
npm install
source ~/.nvm/nvm.sh && nvm use 20.19.5
npm start
```

### Установка на iPhone (Expo Go)
```bash
npm start
# Отсканируйте QR-код в Expo Go
```

### Создание standalone приложения (своя иконка)

**iOS:**
```bash
# Зарегистрируйте устройства
eas device:create

# Создайте build
eas build --profile preview --platform ios

# Отправьте ссылку пользователям
```

**Android:**
```bash
# Создайте build
eas build --profile preview --platform android

# Отправьте ссылку пользователям
```

### Обновление после изменений
```bash
# Приложение обновится автоматически при сохранении файлов
# Если нужна перезагрузка - нажмите 'r' в терминале
```

### Проблемы с подключением
```bash
npm start -- --tunnel
```

### Полная переустановка
```bash
rm -rf node_modules package-lock.json .expo
npm install
npm start -- --clear
```
