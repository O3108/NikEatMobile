# Установка на iPhone без App Store

## Способ 1: Expo Go (Самый простой) ⭐

### Преимущества:
- ✅ Не требует Apple Developer аккаунта
- ✅ Мгновенная установка
- ✅ Легко обновлять

### Шаги:

1. **Установите Expo Go на iPhone**
   - Откройте App Store
   - Найдите "Expo Go"
   - Установите приложение

2. **Запустите приложение на компьютере**
   ```bash
   source ~/.nvm/nvm.sh && nvm use 20.19.5 && npm start
   ```

3. **Откройте на iPhone**
   - Откройте Expo Go
   - Отсканируйте QR-код из терминала
   - Или введите URL вручную

### Ограничения:
- Требуется интернет для первого запуска
- Приложение работает через Expo Go
- Некоторые нативные модули могут не работать

---

## Способ 2: EAS Build (Рекомендуется для production)

### Требования:
- Apple Developer аккаунт ($99/год)
- Устройство зарегистрировано в Apple Developer

### Шаги:

1. **Установите EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Войдите в Expo аккаунт**
   ```bash
   eas login
   ```

3. **Настройте проект**
   ```bash
   eas build:configure
   ```

4. **Зарегистрируйте устройство**
   ```bash
   eas device:create
   ```
   - Откроется браузер
   - Следуйте инструкциям для регистрации iPhone

5. **Создайте development build**
   ```bash
   eas build --profile development --platform ios
   ```

6. **Установите на устройство**
   - После сборки получите ссылку на .ipa файл
   - Откройте ссылку на iPhone
   - Установите приложение

### Преимущества:
- ✅ Standalone приложение
- ✅ Работает офлайн
- ✅ Полный доступ к нативным API
- ✅ Можно распространять через TestFlight

---

## Способ 3: TestFlight (Для тестирования)

### Требования:
- Apple Developer аккаунт ($99/год)

### Шаги:

1. **Создайте production build**
   ```bash
   eas build --profile production --platform ios
   ```

2. **Загрузите в App Store Connect**
   ```bash
   eas submit --platform ios
   ```

3. **Настройте TestFlight**
   - Откройте App Store Connect
   - Перейдите в TestFlight
   - Добавьте тестировщиков (до 10,000 человек)

4. **Установите на iPhone**
   - Установите TestFlight из App Store
   - Откройте приглашение
   - Установите приложение

### Преимущества:
- ✅ Легко распространять
- ✅ До 10,000 тестировщиков
- ✅ Автоматические обновления
- ✅ Сбор отзывов

---

## Способ 4: Xcode (Для разработки)

### Требования:
- Mac с Xcode
- iPhone подключен к Mac
- Apple Developer аккаунт (бесплатный)

### Шаги:

1. **Создайте нативный проект**
   ```bash
   npx expo prebuild
   ```

2. **Откройте в Xcode**
   ```bash
   open ios/NikEatMobile.xcworkspace
   ```

3. **Настройте подписание**
   - Выберите ваш Apple ID в Signing & Capabilities
   - Выберите Team

4. **Подключите iPhone**
   - Подключите iPhone к Mac через USB
   - Разблокируйте iPhone
   - Доверьтесь компьютеру

5. **Запустите на устройстве**
   - Выберите ваш iPhone в списке устройств
   - Нажмите Run (⌘R)

6. **Доверьтесь разработчику на iPhone**
   - Настройки → Основные → VPN и управление устройством
   - Доверьтесь вашему Apple ID

### Ограничения:
- ⚠️ Приложение работает 7 дней, потом нужно переустановить
- ⚠️ Требуется Mac

---

## Рекомендации по выбору способа

### Для быстрого тестирования:
→ **Способ 1: Expo Go**

### Для личного использования:
→ **Способ 2: EAS Build** (development)

### Для распространения команде:
→ **Способ 3: TestFlight**

### Для разработки с нативными модулями:
→ **Способ 4: Xcode**

---

## Настройка для вашего проекта

### 1. Создайте `eas.json`:

```bash
eas build:configure
```

Это создаст файл `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. Обновите `app.json`:

```json
{
  "expo": {
    "name": "NikEat",
    "slug": "nik-eat-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.nikeat",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    }
  }
}
```

### 3. Зарегистрируйте Bundle Identifier:
- Откройте [Apple Developer](https://developer.apple.com)
- Certificates, Identifiers & Profiles
- Identifiers → + (новый)
- App IDs → Continue
- Bundle ID: `com.yourname.nikeat`

---

## Быстрый старт (Expo Go)

Самый простой способ прямо сейчас:

1. **На iPhone:**
   - Установите Expo Go из App Store

2. **На компьютере:**
   ```bash
   npm start
   ```

3. **Подключение:**
   - Откройте Expo Go
   - Отсканируйте QR-код
   - Готово! 🎉

---

## Troubleshooting

### "Unable to connect to Metro"
- Убедитесь, что iPhone и компьютер в одной Wi-Fi сети
- Проверьте firewall на компьютере

### "Network response timed out"
- Используйте туннель: `npm start -- --tunnel`

### "This app is not available"
- Проверьте срок действия сертификата
- Переустановите приложение

---

## Полезные команды

```bash
# Проверка устройств
eas device:list

# Создание development build
eas build --profile development --platform ios

# Создание production build
eas build --profile production --platform ios

# Отправка в App Store Connect
eas submit --platform ios

# Просмотр логов сборки
eas build:list
```

---

## Дополнительные ресурсы

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [TestFlight](https://developer.apple.com/testflight/)
- [Apple Developer Program](https://developer.apple.com/programs/)
