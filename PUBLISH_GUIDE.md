# 📤 Пошаговая инструкция по публикации

## Шаг 1: Создайте аккаунт Expo (если нет)

1. Перейдите на [expo.dev/signup](https://expo.dev/signup)
2. Зарегистрируйтесь (бесплатно)
3. Подтвердите email

## Шаг 2: Установите EAS CLI

```bash
npm install -g eas-cli
```

## Шаг 3: Войдите в аккаунт

```bash
eas login
```

Введите ваш username и password.

## Шаг 4: Настройте проект

```bash
eas update:configure
```

Это создаст конфигурацию для EAS Update. Нажмите Enter для всех вопросов.

## Шаг 5: Опубликуйте приложение

```bash
eas update --branch production --message "Initial release"
```

Дождитесь завершения публикации.

## Шаг 6: Получите ссылку для установки

1. Зайдите на [expo.dev](https://expo.dev/)
2. Выберите проект "nikeat-mobile"
3. Перейдите в раздел "Updates"
4. Нажмите на последнее обновление
5. Скопируйте ссылку или QR-код

Ссылка будет вида:
```
exp://u.expo.dev/[project-id]?channel-name=production
```

## Шаг 5: Создайте QR-код (опционально)

### Способ 1: Через Expo Dashboard

1. Откройте [expo.dev](https://expo.dev/)
2. Выберите проект
3. Нажмите "Share" или "QR Code"
4. Скачайте QR-код

### Способ 2: Онлайн генератор

1. Откройте [qr-code-generator.com](https://www.qr-code-generator.com/)
2. Вставьте вашу ссылку
3. Сгенерируйте QR-код
4. Скачайте изображение

## Шаг 6: Отправьте пользователям

### Вариант 1: Прямая ссылка

Отправьте ссылку:
```
exp://exp.host/@your-username/nikeat-mobile
```

Или web-ссылку:
```
https://expo.dev/@your-username/nikeat-mobile
```

### Вариант 2: QR-код

Отправьте изображение QR-кода.

### Вариант 3: Инструкция

Отправьте эту инструкцию:

```
📱 Как установить NikEat:

1. Установите Expo Go:
   • iOS: App Store → "Expo Go"
   • Android: Google Play → "Expo Go"

2. Откройте Expo Go

3. Отсканируйте QR-код или откройте ссылку:
   [ВАША ССЫЛКА]

4. Приложение загрузится автоматически!

После первой загрузки приложение будет работать офлайн.
```

## Шаг 8: Обновление приложения

Когда вы внесете изменения в код:

```bash
eas update --branch production --message "Bug fixes and improvements"
```

Пользователи получат обновление автоматически при следующем запуске!

---

## 🎯 Полный процесс (копируй и вставляй)

```bash
# 1. Установите EAS CLI
npm install -g eas-cli

# 2. Войдите в Expo
eas login

# 3. Настройте проект
eas update:configure

# 4. Опубликуйте приложение
eas update --branch production --message "Initial release"

# 5. Получите ссылку на expo.dev
# exp://u.expo.dev/[project-id]?channel-name=production

# 6. Отправьте ссылку пользователям
```

---

## 📱 Инструкция для пользователей

Сохраните это и отправьте вашим пользователям:

```markdown
# Установка NikEat

## iOS

1. Откройте App Store
2. Найдите "Expo Go"
3. Установите приложение
4. Откройте Expo Go
5. Нажмите "Scan QR code" или введите ссылку:
   [ВАША ССЫЛКА]
6. Готово! Приложение загрузится

## Android

1. Откройте Google Play
2. Найдите "Expo Go"
3. Установите приложение
4. Откройте Expo Go
5. Нажмите "Scan QR code" или введите ссылку:
   [ВАША ССЫЛКА]
6. Готово! Приложение загрузится

## Важно

- После первой загрузки приложение работает офлайн
- Обновления загружаются автоматически
- Если приложение не открывается - проверьте интернет-соединение
```

---

## 🔧 Troubleshooting

### "Unable to resolve..."

Очистите кеш и попробуйте снова:
```bash
npm start -- --clear
npx expo publish
```

### "Not authorized"

Войдите снова:
```bash
npx expo logout
npx expo login
```

### "Network error"

Проверьте интернет-соединение и попробуйте снова.

### Приложение не обновляется

Пользователи должны:
1. Закрыть приложение полностью
2. Открыть снова
3. Обновление загрузится автоматически

---

## 📊 Мониторинг

### Просмотр статистики

1. Откройте [expo.dev](https://expo.dev/)
2. Выберите проект
3. Вкладка "Analytics"
4. Смотрите:
   - Количество установок
   - Активные пользователи
   - Версии приложения
   - Ошибки

### Просмотр логов

```bash
# Просмотр логов в реальном времени
npx expo start

# Или через EAS
eas update:list
```

---

## 🚀 Продвинутые настройки

### Создание разных окружений

Создайте `app.config.js`:

```javascript
export default {
  expo: {
    name: process.env.APP_ENV === 'production' ? 'NikEat' : 'NikEat Dev',
    slug: 'nikeat-mobile',
    version: '1.0.0',
    // ... остальные настройки
  }
};
```

Публикация:
```bash
# Production
APP_ENV=production npx expo publish --release-channel production

# Development
APP_ENV=development npx expo publish --release-channel development
```

### Настройка каналов обновлений

```bash
# Публикация в разные каналы
npx expo publish --release-channel production
npx expo publish --release-channel beta
npx expo publish --release-channel dev
```

Пользователи могут выбрать канал:
```
exp://exp.host/@your-username/nikeat-mobile?release-channel=beta
```

---

## ✅ Checklist перед публикацией

- [ ] Протестировано на iOS
- [ ] Протестировано на Android
- [ ] API URL настроен правильно (.env)
- [ ] Версия обновлена в app.json
- [ ] Иконка и splash screen готовы
- [ ] Нет критических багов
- [ ] Создан аккаунт Expo
- [ ] Вошли в аккаунт (expo login)

---

## 🎉 Готово!

После публикации:
1. ✅ Приложение доступно по ссылке
2. ✅ Можно установить на любое количество устройств
3. ✅ Обновления автоматические
4. ✅ Работает офлайн
5. ✅ Полностью бесплатно!

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте [Expo Documentation](https://docs.expo.dev/)
2. Поищите на [Expo Forums](https://forums.expo.dev/)
3. Задайте вопрос на [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
