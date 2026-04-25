# Drive Clone

Клон Google Drive на Next.js 15 — папки, загрузка файлов, корзина, избранное и поиск. Каждый пользователь видит только свои файлы.

## Стек

- **Next.js 15** (App Router, Server Actions, React 19)
- **Clerk** — аутентификация
- **Neon Postgres** + **Drizzle ORM** — база данных и миграции
- **UploadThing** — загрузка и хранение файлов
- **Tailwind CSS** — стили
- **TypeScript**

## Возможности

- Регистрация и вход через Clerk
- Создание вложенных папок
- Загрузка файлов любого типа
- Помечать файлы и папки звёздочкой
- Корзина с возможностью восстановления и полного удаления
- Раздел **Recent** — последние загрузки
- Раздел **Starred** — избранное
- Поиск по имени файла/папки
- Хлебные крошки для навигации
- У каждого пользователя своё изолированное пространство

## Структура

```
src/
├── app/                  # Next.js App Router
│   ├── api/uploadthing/  # эндпоинт UploadThing
│   ├── drive/            # редирект на корневую папку
│   ├── f/[folderId]/     # просмотр папки
│   ├── recent/           # последние файлы
│   ├── search/           # поиск
│   ├── starred/          # избранное
│   └── trash/            # корзина
├── components/           # UI-компоненты (sidebar, topbar, строки файлов и т.д.)
├── lib/                  # утилиты и конфиг UploadThing
├── server/
│   ├── actions/          # Server Actions (создание, удаление, восстановление)
│   └── db/               # схема Drizzle и запросы
└── middleware.ts         # защита роутов через Clerk
```

## Переменные окружения

Создай файл `.env` по образцу `.env.example`:

```env
DATABASE_URL=postgres://user:pass@host/db?sslmode=require

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/drive
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/drive

UPLOADTHING_TOKEN=eyJ...
```

Где взять ключи:
- `DATABASE_URL` — [neon.tech](https://neon.tech)
- Clerk-ключи — [dashboard.clerk.com](https://dashboard.clerk.com)
- `UPLOADTHING_TOKEN` — [uploadthing.com/dashboard](https://uploadthing.com/dashboard)

## Запуск локально

```bash
# 1. Установка зависимостей
npm install

# 2. Заполнить .env (см. выше)
cp .env.example .env

# 3. Применить схему БД
npm run db:push

# 4. Старт dev-сервера
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Скрипты

| Команда | Что делает |
| --- | --- |
| `npm run dev` | Dev-сервер на `localhost:3000` |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск production-сборки |
| `npm run lint` | ESLint |
| `npm run db:generate` | Сгенерировать SQL-миграции из схемы |
| `npm run db:push` | Применить схему к БД напрямую |
| `npm run db:studio` | Веб-интерфейс Drizzle Studio для просмотра данных |

## Модель данных

Две таблицы — `folders` и `files`. Корневая папка создаётся автоматически при первом входе пользователя. Удаление мягкое (`deletedAt`), полное удаление чистит и UploadThing, и БД.
