# 🚀 EAS Update - Полное руководство

## Что такое EAS Update?

EAS Update - это современный способ публикации и обновления Expo приложений. Он заменил устаревший `expo publish`.

### Преимущества:
- ✅ Мгновенные обновления (без пересборки)
- ✅ Ветки и каналы для разных окружений
- ✅ Откат к предыдущим версиям
- ✅ Работает с Expo Go и standalone приложениями
- ✅ Полностью бесплатно

---

## Быстрый старт

### 1. Установка

```bash
npm install -g eas-cli
```

### 2. Вход в аккаунт

```bash
eas login
```

### 3. Настройка проекта

```bash
eas update:configure
```

Это создаст/обновит:
- `eas.json` - конфигурация EAS
- `app.json` - добавит настройки updates

### 4. Публикация

```bash
eas update --branch production --message "Initial release"
```

---

## Основные команды

### Публикация обновления

```bash
# Production
eas update --branch production --message "Bug fixes"

# Development
eas update --branch development --message "Testing new feature"

# Staging
eas update --branch staging --message "QA testing"
```

### Просмотр обновлений

```bash
# Список всех обновлений
eas update:list

# Просмотр конкретного обновления
eas update:view [UPDATE_ID]

# Просмотр по ветке
eas update:list --branch production
```

### Откат обновления

```bash
# Откатиться к предыдущей версии
eas update --branch production --message "Rollback" --republish [UPDATE_ID]
```

### Удаление обновления

```bash
eas update:delete [UPDATE_ID]
```

---

## Работа с ветками

### Создание веток

Ветки создаются автоматически при первой публикации:

```bash
eas update --branch production --message "Production release"
eas update --branch development --message "Dev build"
eas update --branch staging --message "Staging build"
```

### Просмотр веток

```bash
eas branch:list
```

### Удаление ветки

```bash
eas branch:delete [BRANCH_NAME]
```

---

## Конфигурация

### app.json

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/[project-id]"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### eas.json

```json
{
  "build": {
    "development": {
      "channel": "development"
    },
    "preview": {
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

---

## Получение ссылки для установки

### Способ 1: Через Dashboard

1. Откройте [expo.dev](https://expo.dev/)
2. Выберите проект
3. Перейдите в "Updates"
4. Скопируйте ссылку или QR-код

### Способ 2: Прямая ссылка

```
exp://u.expo.dev/[project-id]?channel-name=production
```

Где `[project-id]` - ID вашего проекта из expo.dev

### Способ 3: Из вывода команды

После `eas update` в выводе будет ссылка на обновление.

---

## Установка для пользователей

### iOS

1. Установить Expo Go из App Store
2. Открыть Expo Go
3. Отсканировать QR-код или ввести ссылку
4. Готово!

### Android

1. Установить Expo Go из Google Play
2. Открыть Expo Go
3. Отсканировать QR-код или ввести ссылку
4. Готово!

---

## Автоматические обновления

### Как это работает:

1. Вы публикуете обновление: `eas update --branch production`
2. Пользователи открывают приложение
3. Приложение проверяет наличие обновлений
4. Скачивает обновление в фоне
5. При следующем запуске - новая версия!

### Настройка поведения

В `app.json`:

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

Опции `checkAutomatically`:
- `ON_LOAD` - проверять при каждом запуске (по умолчанию)
- `ON_ERROR_RECOVERY` - только при ошибках
- `NEVER` - никогда не проверять

---

## Разные окружения

### Production, Staging, Development

```bash
# Production
eas update --branch production --message "v1.0.0"

# Staging
eas update --branch staging --message "Testing v1.0.0"

# Development
eas update --branch development --message "WIP features"
```

### Разные ссылки для пользователей

```
# Production
exp://u.expo.dev/[project-id]?channel-name=production

# Staging
exp://u.expo.dev/[project-id]?channel-name=staging

# Development
exp://u.expo.dev/[project-id]?channel-name=development
```

---

## Мониторинг

### Просмотр статистики

1. Откройте [expo.dev](https://expo.dev/)
2. Выберите проект
3. Вкладка "Updates"
4. Смотрите:
   - Количество загрузок
   - Активные версии
   - Ошибки

### Логи

```bash
# Просмотр логов обновления
eas update:list --json

# Детали конкретного обновления
eas update:view [UPDATE_ID]
```

---

## Troubleshooting

### "No updates available"

Проверьте:
1. Правильная ли ветка/канал
2. Опубликовано ли обновление
3. Настройки в `app.json`

```bash
# Проверьте список обновлений
eas update:list --branch production
```

### "Update failed to load"

```bash
# Переопубликуйте
eas update --branch production --message "Retry"
```

### "Runtime version mismatch"

Обновите `runtimeVersion` в `app.json`:

```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

И переопубликуйте:
```bash
eas update --branch production --message "Runtime version update"
```

---

## Best Practices

### 1. Используйте осмысленные сообщения

```bash
# ❌ Плохо
eas update --branch production --message "update"

# ✅ Хорошо
eas update --branch production --message "Fix: Resolved login issue #123"
```

### 2. Тестируйте перед production

```bash
# 1. Публикуйте в staging
eas update --branch staging --message "Testing new feature"

# 2. Тестируйте
# ...

# 3. Публикуйте в production
eas update --branch production --message "Release new feature"
```

### 3. Версионируйте обновления

```bash
eas update --branch production --message "v1.2.3: Added dark mode"
```

### 4. Держите changelog

Создайте `UPDATES.md`:

```markdown
# Updates Changelog

## v1.2.3 - 2025-10-17
- Added dark mode
- Fixed login issue
- Improved performance

## v1.2.2 - 2025-10-16
- Bug fixes
```

---

## Сравнение с expo publish

| Функция | expo publish | EAS Update |
|---------|--------------|------------|
| Статус | Устарел ❌ | Актуален ✅ |
| Ветки | Нет | Да ✅ |
| Откат | Нет | Да ✅ |
| Мониторинг | Базовый | Продвинутый ✅ |
| Standalone | Нет | Да ✅ |

---

## Полезные ссылки

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Expo Dashboard](https://expo.dev/)
- [EAS CLI Reference](https://docs.expo.dev/eas-update/eas-cli/)

---

## Шпаргалка команд

```bash
# Установка
npm install -g eas-cli

# Вход
eas login

# Настройка
eas update:configure

# Публикация
eas update --branch production --message "Message"

# Список обновлений
eas update:list

# Просмотр обновления
eas update:view [UPDATE_ID]

# Откат
eas update --branch production --republish [UPDATE_ID]

# Список веток
eas branch:list

# Удаление обновления
eas update:delete [UPDATE_ID]
```

---

## 🎉 Готово!

Теперь вы можете:
- ✅ Публиковать обновления мгновенно
- ✅ Управлять разными окружениями
- ✅ Откатывать изменения при необходимости
- ✅ Мониторить использование
- ✅ Распространять на неограниченное количество устройств
