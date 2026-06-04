# TODO-list

Веб-приложение для управления задачами в команде с иерархией «руководитель — подчинённый».

**Production (фронт):** https://todo-list-client-ecru.vercel.app

**API:** https://todo-api.tailf2240f.ts.net

Подробная инструкция по развёртыванию для всей команды: **[DEPLOY.md](./DEPLOY.md)**

---

## Возможности

- Авторизация по логину и паролю (JWT)
- CRUD задач: создание, редактирование, удаление
- Поля задачи: название, описание, срок, приоритет, статус
- Назначение ответственного среди подчинённых
- Группировка списка: по дате, по ответственному
- Роли: директор и сотрудник

---

## Стек

| Слой     | Технологии                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS 4 |
| Backend  | Node.js, Express 5, Prisma 7, Neon PostgreSQL                |
| Деплой   | Vercel (клиент), Docker + Tailscale Funnel (API)             |

---

## Структура репозитория

```
├── client/           # SPA (Vite + React), vercel.json
├── server/           # Express API, Prisma, Dockerfile
├── docker-compose.yml
├── DEPLOY.md         # Полная инструкция по production
└── package.json      # npm workspaces (server + client)
```

---

## Быстрый старт (локально)

### Требования

- Node.js 20+
- PostgreSQL (рекомендуется [Neon](https://neon.tech))

### Установка

```bash
git clone <repo-url>
cd "TODO list"
npm install
# создайте server/.env и client/.env — переменные см. в DEPLOY.md
```

### База данных

```powershell
cd server
# см. DEPLOY.md — migrate с DIRECT_DATABASE_URL
npx prisma migrate deploy
npm run seed
```

### Запуск

```bash
npm run dev -w server
npm run dev -w client
```

Откройте http://localhost:5173 (логин из `LOGIN_*` / `PASSWORD_*` в `server/.env`).

---

## Production: что должно работать

| Компонент             | Где крутится               |
| --------------------- | -------------------------- |
| Фронт                 | Vercel (всегда онлайн)     |
| БД                    | Neon (облако)              |
| API                   | Docker на вашей машине/VPS |
| Публичный HTTPS к API | Tailscale Funnel           |

---

## API (основные маршруты)

| Метод    | Путь                  | Описание              |
| -------- | --------------------- | --------------------- |
| `GET`    | `/health`             | Проверка API          |
| `POST`   | `/auth/login`         | Вход, JWT             |
| `GET`    | `/tasks`              | Список задач (Bearer) |
| `POST`   | `/tasks`              | Создание              |
| `PATCH`  | `/tasks/:id`          | Обновление            |
| `DELETE` | `/tasks/:id`          | Удаление              |
| `GET`    | `/users/subordinates` | Подчинённые           |

---

## Скрипты

| Команда                   | Назначение            |
| ------------------------- | --------------------- |
| `npm run dev -w server`   | API с hot-reload      |
| `npm run dev -w client`   | Vite dev-сервер       |
| `npm run build -w server` | Сборка API в `dist/`  |
| `npm run build -w client` | Production-сборка SPA |
| `npm run seed -w server`  | Демо-данные в БД      |
