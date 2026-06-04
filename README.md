# TODO-list

Веб-приложение для управления задачами в команде с иерархией «руководитель — подчинённый». Руководитель создаёт задачи и назначает ответственных из своих подчинённых; сотрудник видит назначенные ему задачи и может менять их статус.

**Демо (production):** [https://todo-list-rho-sandy.vercel.app](https://todo-list-rho-sandy.vercel.app)

---

## Возможности

- Авторизация по логину и паролю (JWT)
- CRUD задач: создание, редактирование, удаление
- Поля задачи: название, описание, срок, приоритет (`HIGH` / `MEDIUM` / `LOW`), статус (`TODO` / `IN_PROGRESS` / `DONE` / `CANCELLED`)
- Назначение ответственного только среди подчинённых текущего пользователя
- Группировка списка: без группировки, по дате окончания, по ответственному
- Роли: директор (без `director_id`) и сотрудник (привязан к директору)

---

## Стек технологий

| Слой             | Технологии                                                                       |
| ---------------- | -------------------------------------------------------------------------------- |
| **Frontend**     | React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS 4, Lucide React       |
| **Backend**      | Node.js, Express 5, TypeScript, tsx                                              |
| **БД**           | PostgreSQL, Prisma 7 (адаптер Neon для serverless)                               |
| **Безопасность** | bcrypt, JSON Web Token                                                           |
| **Деплой**       | [Vercel](https://vercel.com) — статика клиента + serverless API (`api/index.ts`) |

---

## Структура репозитория

```
├── client/          # SPA (Vite + React)
├── server/          # Express API, Prisma, бизнес-логика
├── api/             # Точка входа API для Vercel (импорт server/src/app)
└── vercel.json      # Сборка, rewrites API и SPA
```

---

## Требования

- **Node.js** 20+ (рекомендуется LTS)
- **npm**
- База **PostgreSQL** (локально или облако, например [Neon](https://neon.tech))

---

## Локальный запуск

### 1. Клонирование и зависимости

```bash
cd "TODO list"
npm install --prefix server
npm install --prefix client
```

### 2. Переменные окружения

**`server/.env`** (создайте по образцу):

```env
PORT=3001
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

JWT_SECRET="ваш-секретный-ключ"

LOGIN_DIRECTOR="director"
PASSWORD_DIRECTOR="ваш-пароль-директора"

LOGIN_WORKER="worker"
PASSWORD_WORKER="ваш-пароль-сотрудника"
```

**`client/.env`:**

```env
VITE_API_URL=http://localhost:3001
```

На Vercel для production `VITE_API_URL` обычно **не задают** (пустая строка): запросы идут на тот же домен, а `vercel.json` проксирует `/auth`, `/tasks`, `/users` и т.д. на serverless-функцию.

### 3. База данных

Из каталога `server/`:

```bash
npx prisma migrate deploy
npm run seed
```

`seed` создаёт двух пользователей (директор и сотрудник) и демо-задачи. Логины и пароли берутся из `LOGIN_*` / `PASSWORD_*` в `server/.env`.

### 4. Запуск в режиме разработки

В двух терминалах:

```bash
# API
npm run dev --prefix server

# Frontend (по умолчанию http://localhost:5173)
npm run dev --prefix client
```

Откройте в браузере адрес Vite (обычно `http://localhost:5173`), войдите учётными данными из seed.

### 5. Сборка (опционально)

```bash
npm run build --prefix server
npm run build --prefix client
```

Превью клиента: `npm run preview --prefix client`.

---

## API (основные маршруты)

| Метод    | Путь                  | Описание                                           |
| -------- | --------------------- | -------------------------------------------------- |
| `GET`    | `/health`             | Проверка работы API                                |
| `GET`    | `/db-check`           | Проверка подключения к БД                          |
| `POST`   | `/auth/login`         | Вход, возвращает JWT                               |
| `GET`    | `/tasks`              | Список задач (требуется `Authorization: Bearer …`) |
| `POST`   | `/tasks`              | Создание задачи                                    |
| `PATCH`  | `/tasks/:id`          | Обновление задачи                                  |
| `DELETE` | `/tasks/:id`          | Удаление задачи                                    |
| `GET`    | `/users/subordinates` | Подчинённые текущего пользователя                  |

---

## Деплой на Vercel

Проект настроен через `vercel.json`:

- сборка клиента и генерация Prisma-клиента;
- API как serverless-функция из `api/index.ts`;
- SPA: все маршруты, кроме статики, отдают `index.html`.

Публичный URL: **[https://todo-list-rho-sandy.vercel.app](https://todo-list-rho-sandy.vercel.app)**

В настройках проекта Vercel нужно задать переменные окружения (`DATABASE_URL`, `JWT_SECRET`, `LOGIN_*`, `PASSWORD_*` и при необходимости `VITE_API_URL`).

---

## Скрипты npm

| Каталог  | Команда         | Назначение                      |
| -------- | --------------- | ------------------------------- |
| `server` | `npm run dev`   | API с hot-reload (tsx watch)    |
| `server` | `npm run start` | API без watch                   |
| `server` | `npm run build` | `prisma generate`               |
| `server` | `npm run seed`  | Заполнение БД тестовыми данными |
| `client` | `npm run dev`   | Dev-сервер Vite                 |
| `client` | `npm run build` | Production-сборка               |
| `client` | `npm run lint`  | ESLint                          |
