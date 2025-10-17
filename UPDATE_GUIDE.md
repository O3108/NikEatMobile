# 🔄 Обновление приложения в Expo

## Два типа обновлений

### 1. ⚡ Быстрое обновление (EAS Update)
Для изменений в коде JavaScript/TypeScript - **мгновенно**

### 2. 🔨 Полная пересборка (EAS Build)
Для изменений в нативном коде - **15-20 минут**

---

## ⚡ Быстрое обновление (EAS Update)

### Когда использовать:
- ✅ Изменения в React компонентах
- ✅ Изменения в логике приложения
- ✅ Исправления багов
- ✅ Обновление текстов
- ✅ Изменения в стилях
- ✅ Обновление API endpoints

### Команда:

```bash
eas update --branch production --message "Описание изменений"
```

### Примеры:

```bash
# Исправление бага
eas update --branch production --message "fix: Исправлена ошибка в калькуляторе"

# Новая функция
eas update --branch production --message "feat: Добавлен таймер напоминаний"

# Улучшения
eas update --branch production --message "improve: Улучшен интерфейс настроек"
```

### Как получат пользователи:
1. Пользователи открывают приложение
2. Приложение автоматически проверяет обновления
3. Скачивает изменения в фоне
4. При следующем запуске - новая версия!

⏱️ **Время:** Мгновенно (пользователи получат через несколько секунд)

---

## 🔨 Полная пересборка (EAS Build)

### Когда использовать:
- ⚠️ Обновление Expo SDK
- ⚠️ Добавление нативных модулей
- ⚠️ Изменение permissions
- ⚠️ Изменение иконки/splash screen
- ⚠️ Изменение Bundle ID
- ⚠️ Обновление зависимостей с нативным кодом

### Команды:

```bash
# iOS
eas build --profile preview --platform ios

# Android
eas build --profile preview --platform android

# Оба
eas build --profile preview --platform all
```

### Как получат пользователи:
1. Вы создаете новую сборку
2. Получаете новую ссылку на .ipa/.apk
3. Отправляете ссылку пользователям
4. Они устанавливают обновление

⏱️ **Время:** 15-20 минут (сборка) + установка пользователями

---

## 📋 Пошаговая инструкция

### Сценарий 1: Изменили код (JS/TS)

```bash
# 1. Внесите изменения в код
# 2. Проверьте, что работает
npm start

# 3. Опубликуйте обновление
eas update --branch production --message "Описание изменений"

# 4. Готово! Пользователи получат обновление автоматически
```

### Сценарий 2: Добавили новую зависимость

**Если зависимость только JS:**
```bash
npm install new-package
eas update --branch production --message "Added new-package"
```

**Если зависимость с нативным кодом:**
```bash
npm install new-native-package
eas build --profile preview --platform all
# Отправьте новую ссылку пользователям
```

### Сценарий 3: Обновили Expo SDK

```bash
# 1. Обновите SDK
npx expo upgrade

# 2. Проверьте, что работает
npm start

# 3. Создайте новую сборку
eas build --profile preview --platform all

# 4. Отправьте новую ссылку пользователям
```

---

## 🎯 Быстрая справка

### Текущее обновление (после изменений):

```bash
# Проверьте изменения
git status

# Закоммитьте
git add .
git commit -m "feat: Your changes"

# Опубликуйте в Expo
eas update --branch production --message "Your changes"

# Push в GitHub
git push
```

### Одной командой:

```bash
git add . && git commit -m "feat: Changes" && eas update --branch production --message "Changes" && git push
```

---

## 📊 Управление обновлениями

### Просмотр обновлений

```bash
# Список всех обновлений
eas update:list

# Обновления конкретной ветки
eas update:list --branch production

# Детали обновления
eas update:view [UPDATE_ID]
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

## 🌿 Работа с ветками

### Production (для пользователей)

```bash
eas update --branch production --message "Stable release"
```

### Development (для тестирования)

```bash
eas update --branch development --message "Testing new feature"
```

### Staging (для QA)

```bash
eas update --branch staging --message "QA testing"
```

---

## 📱 Версионирование

### Обновление версии в app.json

```json
{
  "expo": {
    "version": "1.0.1",  // Увеличьте версию
    "ios": {
      "buildNumber": "1.0.1"
    },
    "android": {
      "versionCode": 2  // Увеличьте на 1
    }
  }
}
```

После изменения версии:
```bash
eas update --branch production --message "v1.0.1: Bug fixes"
```

---

## 🔍 Проверка обновлений

### Локально

```bash
# Запустите приложение
npm start

# Проверьте в Expo Go или на устройстве
```

### На устройстве

1. Откройте приложение
2. Потяните вниз для обновления (pull-to-refresh)
3. Или закройте и откройте снова

### В Dashboard

1. Откройте [expo.dev](https://expo.dev/)
2. Выберите проект
3. Вкладка "Updates"
4. Смотрите статистику загрузок

---

## ⚠️ Важные моменты

### EAS Update работает только для:
- ✅ Standalone приложений (созданных через EAS Build)
- ✅ Expo Go (для тестирования)

### EAS Update НЕ работает для:
- ❌ Изменений в нативном коде
- ❌ Новых permissions
- ❌ Обновления SDK

### Пользователи получат обновление:
- При запуске приложения
- При pull-to-refresh (если реализовано)
- В фоне (если настроено)

---

## 🚀 Автоматизация

### GitHub Actions (CI/CD)

Создайте `.github/workflows/update.yml`:

```yaml
name: EAS Update

on:
  push:
    branches: [main, master]

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm install
      
      - name: Publish update
        run: eas update --branch production --message "${{ github.event.head_commit.message }}"
```

---

## 📝 Changelog

Ведите changelog для отслеживания изменений:

**UPDATES.md:**
```markdown
# Updates Changelog

## v1.0.2 - 2025-10-17
- Добавлен таймер напоминаний
- Исправлена ошибка в калькуляторе
- Улучшен интерфейс

## v1.0.1 - 2025-10-16
- Исправлены мелкие баги
- Оптимизирована производительность
```

---

## 🎯 Best Practices

### 1. Тестируйте перед публикацией

```bash
# Тестируйте в development
eas update --branch development --message "Testing"

# Проверьте на устройстве
# Затем публикуйте в production
eas update --branch production --message "Release"
```

### 2. Используйте осмысленные сообщения

```bash
# ❌ Плохо
eas update --branch production --message "update"

# ✅ Хорошо
eas update --branch production --message "fix: Resolved timer notification issue"
```

### 3. Версионируйте обновления

```bash
eas update --branch production --message "v1.0.2: Added timer feature"
```

### 4. Мониторьте обновления

Регулярно проверяйте:
- Количество загрузок
- Ошибки
- Активные версии

---

## ❓ FAQ

### Как часто можно обновлять?

Сколько угодно! Нет ограничений.

### Сколько времени занимает обновление?

- **EAS Update:** Мгновенно (секунды)
- **EAS Build:** 15-20 минут

### Нужен ли интернет?

Да, для получения обновления. После загрузки работает офлайн.

### Можно ли откатить обновление?

Да! Используйте `eas update --republish [UPDATE_ID]`

### Что если пользователь не обновляется?

Обновление загрузится при следующем запуске приложения.

---

## 🎉 Готово!

Теперь вы знаете как обновлять приложение в Expo!

**Быстрая команда:**
```bash
eas update --branch production --message "Your changes"
```
