# Развёртывание

## Бэкенд: Docker + Tailscale

### 1. Подготовка

1. [Tailscale](https://tailscale.com/download) на машине, где будет Docker.
2. В [Admin → Keys](https://login.tailscale.com/admin/settings/keys) создайте **Reusable + Ephemeral** auth key.
3. Скопируйте `server/.env.example` → `server/.env`, заполните `DATABASE_URL`, `JWT_SECRET`, логины.
4. В корне: `.env.example` → `.env`, укажите `TS_AUTHKEY`.
5. В `server/.env` добавьте `CORS_ORIGINS` с URL Vercel (см. ниже).

### 2. Запуск

```bash
docker compose up -d --build
```

Проверка из tailnet (с устройства в той же сети Tailscale):

```bash
curl http://todo-api:3001/health
```

### 3. Доступ для Vercel (Tailscale Funnel)

Браузер на Vercel **не** видит приватный tailnet. Нужен публичный HTTPS через Funnel:

```bash
docker exec -it todo-tailscale tailscale funnel 3001
```

Скопируйте выданный URL (например `https://todo-api.<tailnet>.ts.net`) — это `VITE_API_URL` для Vercel.

Отключить Funnel:

```bash
docker exec -it todo-tailscale tailscale funnel --https=3001 off
```

Альтернатива без публичного API: фронт только локально / только с Tailscale на ПК (не типичный сценарий для Vercel).

---

## Клиент: Vercel

### 1. Репозиторий

Подключите GitHub/GitLab репозиторий в [vercel.com](https://vercel.com).

### 2. Настройки проекта

| Параметр | Значение |
|----------|----------|
| Root Directory | `client` |
| Framework Preset | Vite |
| Install Command | `npm install` (или пусто — подхватит `client/vercel.json`) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Важно:** не используйте `npm run build --prefix server` и не собирайте папку `server` на Vercel — бэкенд в Docker, не на Vercel.

Если в Dashboard уже задана своя Build Command — сбросьте на дефолт (Override → Use project settings) или удалите override, чтобы применился `client/vercel.json`.

### Ошибка `client/server/package.json` ENOENT

Причина: Root Directory = `client`, а Build Command пытается собрать `server` (`--prefix server` → путь `client/server`).

Исправление: Build Command = `npm run build`, без `--prefix server`.

### 3. Переменные окружения

| Имя | Значение |
|-----|----------|
| `VITE_API_URL` | URL API (Funnel: `https://todo-api.<tailnet>.ts.net` **без** слэша в конце) |

Пересоберите деплой после изменения env.

### 4. CORS на сервере

В `server/.env` / `CORS_ORIGINS` укажите точный origin Vercel, например:

```
CORS_ORIGINS=https://your-app.vercel.app
```

Для preview-деплоев добавьте через запятую: `https://your-app.vercel.app,https://your-app-xxx.vercel.app`

### 5. Проверка

1. Откройте сайт на Vercel → логин.
2. DevTools → Network: запросы идут на `VITE_API_URL`, без CORS-ошибок.

---

## Локальная разработка

- Сервер: `cd server && npm run dev`
- Клиент: `cd client`, в `.env` — `VITE_API_URL=http://localhost:3001`
