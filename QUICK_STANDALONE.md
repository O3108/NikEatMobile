# ⚡ Быстрое создание standalone приложения

## Что получите:
- 📱 Своя иконка на главном экране
- 🚀 Работает без Expo Go
- ⚡ Быстрые обновления

---

## iOS (3 команды)

```bash
# 1. Зарегистрируйте устройства (один раз)
eas device:create

# 2. Создайте build (15-20 минут)
eas build --profile preview --platform ios

# 3. Отправьте ссылку пользователям
# Они откроют на iPhone и установят
```

### Установка на iPhone:
1. Откройте ссылку на iPhone (в Safari)
2. Нажмите "Install"
3. Настройки → Основные → VPN и управление устройством → Доверять
4. Готово! Иконка на главном экране 🎉

### Требования:
- Apple Developer аккаунт ($99/год)
- До 100 устройств в год

---

## Android (1 команда)

```bash
# Создайте build (10-15 минут)
eas build --profile preview --platform android
```

### Установка на Android:
1. Откройте ссылку на Android
2. Разрешите установку из неизвестных источников
3. Нажмите "Install"
4. Готово! Иконка на главном экране 🎉

### Требования:
- Бесплатно
- Неограниченное количество устройств

---

## Обновление приложения

После установки standalone приложения:

```bash
# Быстрое обновление (без пересборки)
eas update --branch production --message "Bug fixes"
```

Пользователи получат обновление автоматически! ⚡

---

## Для большого количества пользователей

### iOS (до 10,000 человек) - TestFlight

```bash
# 1. Создайте production build
eas build --profile production --platform ios

# 2. Отправьте в App Store Connect
eas submit --platform ios

# 3. Настройте TestFlight на appstoreconnect.apple.com
# 4. Пригласите пользователей
```

Пользователи:
1. Устанавливают TestFlight из App Store
2. Открывают приглашение
3. Устанавливают приложение
4. Готово!

---

## Сравнение

| Способ | Устройств | Стоимость | Сложность |
|--------|-----------|-----------|-----------|
| **Ad Hoc (iOS)** | 100/год | $99/год | ⭐⭐ |
| **APK (Android)** | ∞ | Бесплатно | ⭐ |
| **TestFlight** | 10,000 | $99/год | ⭐⭐ |

---

## Рекомендация

### Для 2-5 человек:
```bash
# iOS
eas device:create
eas build --profile preview --platform ios

# Android
eas build --profile preview --platform android
```

### Для 5+ человек:
```bash
# iOS - используйте TestFlight
eas build --profile production --platform ios
eas submit --platform ios

# Android - прямая установка APK
eas build --profile preview --platform android
```

---

## Полная документация

См. [STANDALONE_BUILD.md](./STANDALONE_BUILD.md) для подробной инструкции.

---

## ✅ Итого

1. Запустите команду build
2. Дождитесь завершения (10-20 минут)
3. Отправьте ссылку пользователям
4. Они установят приложение
5. Иконка на главном экране! 🎉

Обновления через `eas update` - мгновенные! ⚡
