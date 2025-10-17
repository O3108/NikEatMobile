# 📦 Git - Руководство по работе с репозиторием

## ✅ Текущий статус

Проект уже добавлен в Git:
- ✅ Все файлы закоммичены
- ✅ 39 файлов добавлено
- ✅ Готово к push на GitHub

---

## Добавление на GitHub

### Шаг 1: Создайте репозиторий на GitHub

1. Откройте [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `NikEatMobile` (или любое другое)
4. **НЕ** создавайте README, .gitignore, license (они уже есть)
5. Нажмите "Create repository"

### Шаг 2: Подключите remote

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/NikEatMobile.git
```

Или с SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/NikEatMobile.git
```

### Шаг 3: Push на GitHub

```bash
# Первый push
git push -u origin master
```

Или если используете main:
```bash
git branch -M main
git push -u origin main
```

**Готово!** Проект на GitHub! 🎉

---

## Основные команды Git

### Просмотр статуса

```bash
# Посмотреть изменения
git status

# Посмотреть историю коммитов
git log --oneline

# Посмотреть последний коммит
git show
```

### Добавление изменений

```bash
# Добавить все изменения
git add .

# Добавить конкретный файл
git add src/screens/CalculatorScreen.tsx

# Добавить несколько файлов
git add src/screens/*.tsx
```

### Создание коммита

```bash
# Коммит с сообщением
git commit -m "feat: Add new feature"

# Коммит всех изменений (без git add)
git commit -am "fix: Bug fix"

# Изменить последний коммит
git commit --amend -m "New message"
```

### Отправка на GitHub

```bash
# Push в текущую ветку
git push

# Push в конкретную ветку
git push origin master

# Force push (осторожно!)
git push -f
```

### Получение изменений

```bash
# Получить изменения с GitHub
git pull

# Получить изменения без merge
git fetch
```

---

## Работа с ветками

### Создание веток

```bash
# Создать новую ветку
git branch feature/new-screen

# Создать и переключиться
git checkout -b feature/new-screen

# Или (новый синтаксис)
git switch -c feature/new-screen
```

### Переключение веток

```bash
# Переключиться на ветку
git checkout master
git checkout feature/new-screen

# Или (новый синтаксис)
git switch master
git switch feature/new-screen
```

### Слияние веток

```bash
# Переключиться на master
git checkout master

# Слить ветку
git merge feature/new-screen

# Удалить ветку после слияния
git branch -d feature/new-screen
```

### Список веток

```bash
# Локальные ветки
git branch

# Все ветки (включая remote)
git branch -a

# Удалить ветку
git branch -d branch-name
```

---

## Отмена изменений

### Отменить изменения в файле

```bash
# Отменить изменения (до git add)
git restore src/screens/CalculatorScreen.tsx

# Отменить все изменения
git restore .
```

### Убрать из staging

```bash
# Убрать файл из staging (после git add)
git restore --staged src/screens/CalculatorScreen.tsx

# Убрать все из staging
git restore --staged .
```

### Отменить коммит

```bash
# Отменить последний коммит (изменения остаются)
git reset --soft HEAD~1

# Отменить последний коммит (изменения удаляются)
git reset --hard HEAD~1

# Отменить несколько коммитов
git reset --soft HEAD~3
```

---

## .gitignore

Файл `.gitignore` уже настроен и игнорирует:

```
# Зависимости
node_modules/

# Expo
.expo/
.expo-shared/

# Окружение
.env

# IDE
.vscode/
.idea/

# OS
.DS_Store

# Build
dist/
build/
```

### Добавить в .gitignore

```bash
# Отредактируйте .gitignore
echo "my-secret-file.txt" >> .gitignore

# Закоммитьте
git add .gitignore
git commit -m "chore: Update .gitignore"
```

---

## Типы коммитов (Conventional Commits)

Используйте префиксы для коммитов:

```bash
# Новая функция
git commit -m "feat: Add dark mode"

# Исправление бага
git commit -m "fix: Resolve login issue"

# Документация
git commit -m "docs: Update README"

# Стили (форматирование)
git commit -m "style: Format code"

# Рефакторинг
git commit -m "refactor: Simplify calculation logic"

# Тесты
git commit -m "test: Add unit tests"

# Настройка
git commit -m "chore: Update dependencies"

# Performance
git commit -m "perf: Optimize rendering"
```

---

## Работа с удаленным репозиторием

### Просмотр remote

```bash
# Список remote
git remote -v

# Добавить remote
git remote add origin https://github.com/username/repo.git

# Изменить remote URL
git remote set-url origin https://github.com/username/new-repo.git

# Удалить remote
git remote remove origin
```

### Клонирование

```bash
# Клонировать репозиторий
git clone https://github.com/username/NikEatMobile.git

# Клонировать в конкретную папку
git clone https://github.com/username/NikEatMobile.git my-folder
```

---

## Полезные команды

### Просмотр изменений

```bash
# Посмотреть изменения (до git add)
git diff

# Посмотреть изменения в staging
git diff --staged

# Посмотреть изменения в конкретном файле
git diff src/screens/CalculatorScreen.tsx
```

### Поиск

```bash
# Найти в истории
git log --grep="bug fix"

# Найти коммиты автора
git log --author="Your Name"

# Найти изменения в файле
git log -p src/screens/CalculatorScreen.tsx
```

### Stash (временное сохранение)

```bash
# Сохранить изменения
git stash

# Посмотреть список stash
git stash list

# Применить последний stash
git stash pop

# Применить конкретный stash
git stash apply stash@{0}

# Удалить stash
git stash drop
```

---

## Настройка Git

### Глобальные настройки

```bash
# Имя и email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Редактор по умолчанию
git config --global core.editor "code --wait"

# Алиасы
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Посмотреть настройки
git config --list
```

### Локальные настройки (для проекта)

```bash
# Настройки только для этого проекта
git config user.name "Project Name"
git config user.email "project@example.com"
```

---

## GitHub Actions (CI/CD)

### Пример workflow для проверки кода

Создайте `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm install
      
    - name: Check TypeScript
      run: npx tsc --noEmit
```

---

## Быстрые команды

```bash
# Полный цикл: add → commit → push
git add .
git commit -m "feat: New feature"
git push

# Или одной командой (для tracked файлов)
git commit -am "fix: Bug fix" && git push

# Создать ветку, сделать изменения, push
git checkout -b feature/new-feature
# ... делаете изменения ...
git add .
git commit -m "feat: Add new feature"
git push -u origin feature/new-feature
```

---

## Troubleshooting

### Конфликты при merge

```bash
# Посмотреть конфликты
git status

# Отредактируйте файлы с конфликтами
# Найдите <<<<<<< HEAD и >>>>>>> branch-name

# После разрешения конфликтов
git add .
git commit -m "Resolve merge conflicts"
```

### Случайно закоммитили .env

```bash
# Удалить из Git, но оставить локально
git rm --cached .env

# Добавить в .gitignore
echo ".env" >> .gitignore

# Закоммитить
git add .gitignore
git commit -m "chore: Remove .env from Git"
```

### Изменить автора последнего коммита

```bash
git commit --amend --author="Your Name <your.email@example.com>"
```

---

## Полезные алиасы

Добавьте в `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = restore --staged
    last = log -1 HEAD
    visual = log --oneline --graph --all
    amend = commit --amend --no-edit
```

Используйте:
```bash
git st
git co master
git br
git ci -m "message"
```

---

## 📚 Дополнительные ресурсы

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ✅ Checklist перед push

- [ ] Проверить статус: `git status`
- [ ] Проверить изменения: `git diff`
- [ ] Добавить файлы: `git add .`
- [ ] Создать коммит: `git commit -m "message"`
- [ ] Проверить, что всё закоммичено: `git status`
- [ ] Push: `git push`

🎉 Готово!
