# Развёртывание (Docker + Tailscale + Vercel)

## Публичные адреса этого проекта

| Сервис                     | URL                                      |
| -------------------------- | ---------------------------------------- |
| **Фронт (Vercel)**         | https://todo-list-client-ecru.vercel.app |
| **API (Tailscale Funnel)** | https://todo-api.tailf2240f.ts.net       |

URL Funnel привязан к вашему tailnet. После первого `funnel --bg` свой адрес смотрите так:

```bash
docker exec todo-tailscale tailscale funnel status
```

---

## Архитектура

```
Браузер → Vercel (статика React)
              ↓ VITE_API_URL
         Tailscale Funnel (HTTPS)
              ↓
         Docker: todo-api :3001
              ↓
         Neon PostgreSQL
```

---

## Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2 на Windows)
- [Tailscale](https://tailscale.com/download) на хосте
- Аккаунт [Neon](https://neon.tech) (PostgreSQL)
- Аккаунт [Vercel](https://vercel.com)

---

## 1. Подготовка окружения

### 1.1. Файлы конфигурации

Создайте файлы вручную (из корня репозитория):

- `.env` — для Docker Compose (`TS_AUTHKEY`, опционально `SKIP_DB_MIGRATE`)
- `server/.env` — для API и Prisma
- `client/.env` — только для локальной разработки (`VITE_API_URL`)

Заполните:

| Файл          | Переменные                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| `.env`        | `TS_AUTHKEY` — [ключ Tailscale](https://login.tailscale.com/admin/settings/keys) (Reusable + Ephemeral)        |
| `server/.env` | `DATABASE_URL` (pooled), `DIRECT_DATABASE_URL` (direct), `JWT_SECRET`, `LOGIN_*`, `PASSWORD_*`, `CORS_ORIGINS` |

**Neon:** в консоли два connection string — **Pooled** → `DATABASE_URL`, **Direct** → `DIRECT_DATABASE_URL` (в хосте **нет** `-pooler`).

**CORS:** укажите origin Vercel без слэша в конце, например:

```env
CORS_ORIGINS=https://todo-list-client-ecru.vercel.app
```

Для preview-деплоев добавьте через запятую.

### 1.2. Миграции БД (один раз на машине разработчика)

Из `server/`, с **direct** URL (не pooler):

**PowerShell:**

```powershell
cd server
$line = Get-Content .env | Where-Object { $_ -match '^DIRECT_DATABASE_URL=' }
$env:DATABASE_URL = ($line -replace '^DIRECT_DATABASE_URL="?|"$','')
$env:PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK = "true"
npx prisma migrate deploy
npm run seed
```

**bash:**

```bash
cd server
export DATABASE_URL="$DIRECT_DATABASE_URL"
export PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true
npx prisma migrate deploy
npm run seed
```

---

## 2. Запуск бэкенда (Docker + Tailscale)

Все команды — **из корня репозитория**, не из `server/`:

```bash
docker compose up -d --build
```

Проверка API внутри tailnet:

```bash
docker exec todo-api wget -qO- http://127.0.0.1:3001/health
# ожидается: {"ok":true}
```

### Tailscale Funnel (доступ для Vercel)

```bash
# в фоне (рекомендуется)
docker exec -d todo-tailscale tailscale funnel --bg 3001

# статус и URL
docker exec todo-tailscale tailscale funnel status
```

Скопируйте HTTPS-URL (например `https://todo-api.<tailnet>.ts.net`) — он нужен для `VITE_API_URL` на Vercel.

Проверка с интернета:

```bash
curl https://todo-api.tailf2240f.ts.net/health
```

Отключить Funnel:

```bash
docker exec todo-tailscale tailscale funnel --https=3001 off
```

### Миграции при старте контейнера

По умолчанию `SKIP_DB_MIGRATE=true` в `docker-compose.yml`, чтобы контейнер не зависал на Neon advisory lock. Схему применяйте вручную (раздел 1.2).

Чтобы гонять migrate при каждом старте: в корневом `.env` задайте `SKIP_DB_MIGRATE=false`.

---

## 3. После перезагрузки ПК

```bash
docker compose up -d
docker exec -d todo-tailscale tailscale funnel --bg 3001
docker exec todo-tailscale tailscale funnel status
```

---

## 4. Клиент на Vercel

Репозиторий: [Nexxxit/TODO-list](https://github.com/Nexxxit/TODO-list) (или ваш fork).

### Настройки проекта

| Параметр         | Значение        |
| ---------------- | --------------- |
| Root Directory   | `client`        |
| Framework Preset | Vite            |
| Install Command  | `npm install`   |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Node.js Version  | 20.x            |

**Не используйте** `npm run build --prefix server` и `npm install --prefix=..` — бэкенд не на Vercel.

Настройки зафиксированы в `client/vercel.json` (Root Directory = `client`). Корневого `vercel.json` и папки `api/` в репозитории нет — это был старый serverless-вариант API на Vercel.

Не путать с `client/src/api/` — это HTTP-клиент фронта, его не удалять.

### Переменные окружения (Vercel)

| Имя            | Значение                                                                   |
| -------------- | -------------------------------------------------------------------------- |
| `VITE_API_URL` | `https://todo-api.tailf2240f.ts.net` (ваш Funnel URL, **без** `/` в конце) |

После изменения — **Redeploy**.

### Проверка

1. Откройте https://todo-list-client-ecru.vercel.app
2. F12 → Network → логин
3. Запросы на `https://todo-api....ts.net/auth/login`, статус 200, без CORS

---

## 5. Локальная разработка

```bash
# терминал 1
cd server && npm run dev

# терминал 2
cd client && npm run dev
```

`client/.env`:

```env
VITE_API_URL=http://localhost:3001
```

---

## Частые ошибки

### `funnel: command not found` в PowerShell

Funnel не ставится на Windows отдельно. Команда только через Docker:

```bash
docker exec todo-tailscale tailscale funnel status
```

### `prisma migrate deploy` → P1002 (advisory lock)

Используется pooler вместо direct. Задайте `DATABASE_URL` из `DIRECT_DATABASE_URL` и `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true` (см. раздел 1.2).

### Vercel: `client/server/package.json` ENOENT

В Build Command указан `--prefix server`. Должно быть: `npm run build`, Root Directory = `client`.

### Funnel 502, в Docker health OK

Funnel не запущен или остановлен Ctrl+C. Снова: `docker exec -d todo-tailscale tailscale funnel --bg 3001`.

### `exec /docker-entrypoint.sh: no such file`

CRLF в `docker-entrypoint.sh` на Windows. В Dockerfile уже есть `sed` для исправления — пересоберите: `docker compose up -d --build`.

---

## Чеклист для нового разработчика

- [ ] `server/.env` и `.env` заполнены
- [ ] `npx prisma migrate deploy` + `npm run seed` прошли на direct URL
- [ ] `docker compose up -d --build` из корня
- [ ] `docker exec ... funnel --bg 3001`
- [ ] `/health` отвечает по Funnel URL
- [ ] На Vercel задан `VITE_API_URL`, сделан Redeploy
- [ ] `CORS_ORIGINS` совпадает с URL Vercel
- [ ] Логин на https://todo-list-client-ecru.vercel.app работает
