# Журнал работ

Внутренний инструмент для фиксации выполненных работ на строительных объектах.

## Стек

Внутренний CRUD и журнал работ по строительным объектам: нужны предсказуемая структура API, общие типы на границе клиент–сервер и запуск одной командой. Выбран монорепозиторий (pnpm + Turborepo): API, SPA и пакет `packages/shared` в одном репозитории — меньше рассинхрона DTO, общий `pnpm dev`. На backend — Nest.js с упрощённым DDD (явные use case’ы и репозитории) и Prisma поверх PostgreSQL (миграции, типобезопасные запросы к схеме «объект → записи журнала»). На frontend — React SPA на Vite: React Query кэширует ответы API, Zustand хранит только фильтры журнала, react-hook-form и Zod — валидация форм на отдельных маршрутах. Деплой — Docker Compose и nginx: воспроизводимый старт без ручной настройки Node и БД.

| Слой | Технологии | Почему |
|------|------------|--------|
| Monorepo | pnpm workspaces + Turborepo | Единая установка зависимостей, параллельный `dev` |
| Общие типы | `packages/shared` | Один источник правды для DTO между API и web |
| Backend | Nest.js (DDD), Prisma, PostgreSQL | Явные use cases, типобезопасный доступ к БД |
| Сборка web | Vite, React Router | Быстрый dev/build, маршруты = отдельные страницы форм |
| Frontend | React, TypeScript, React Query, Zustand, react-hook-form, Zod, Tailwind, shadcn/ui | Кэш API, лёгкий стейт фильтров, валидация форм, доступные компоненты |
| Деплой | Docker Compose, nginx | `docker compose up` поднимает БД, API и статику; `/api` проксируется на Nest |

Формы — отдельные страницы, без модальных окон.

## Модель данных

```mermaid
erDiagram
  ConstructionSite ||--o{ JournalEntry : has
  WorkType ||--o{ JournalEntry : classifies
  Employee ||--o{ JournalEntry : executes
```

- **ConstructionSite** — строительный объект; у каждого свой журнал работ
- **Employee** — сотрудник (бригадир / рабочий), выбирается как исполнитель
- **WorkType** — справочник видов работ (код, единица по умолчанию)
- **JournalEntry** — запись журнала: дата, вид работ, объём, исполнитель

## Функциональность

- CRUD строительных объектов, сотрудников, видов работ
- Журнал работ в контексте выбранного объекта
- Фильтр по датам, сортировка, создание / редактирование / удаление записей

## Быстрый старт

### Требования

- Docker и Docker Compose

### Запуск всего проекта

```bash
docker compose up -d --build
```

- Web: http://localhost:5173
- API доступен через nginx по пути `/api` (внутри сети Docker — сервис `api:3000`)

При первом запуске API выполнит миграции Prisma и seed. После изменений в коде пересоберите образы:

```bash
docker compose up -d --build
```

Остановка:

```bash
docker compose down
```

С удалением данных БД:

```bash
docker compose down -v
```

### Локальная разработка (без Docker для приложения)

Требования: Node.js 20+, pnpm 9+, Docker (только PostgreSQL).

```bash
docker compose up -d postgres
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm setup
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:3000/api

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET/POST | `/api/construction-sites` | Список / создание объектов |
| GET/PATCH/DELETE | `/api/construction-sites/:id` | Объект |
| GET/POST | `/api/employees` | Сотрудники |
| GET/PATCH/DELETE | `/api/employees/:id` | Сотрудник |
| GET/POST | `/api/work-types` | Виды работ |
| GET/PATCH/DELETE | `/api/work-types/:id` | Вид работ |
| GET/POST | `/api/construction-sites/:siteId/journal-entries` | Журнал объекта |
| GET/PATCH/DELETE | `/api/construction-sites/:siteId/journal-entries/:id` | Запись журнала |

Query для журнала: `dateFrom`, `dateTo`, `sort=workDate:asc|desc`

## Структура репозитория

```
apps/api/src/
  construction-site/   # CRUD объектов
  employee/            # CRUD сотрудников
  work-type/           # CRUD видов работ
  journal/             # записи журнала (привязаны к объекту)
apps/web/              # React SPA
packages/shared/       # общие типы DTO
```

## Переменные окружения

**apps/api/.env**

```
DATABASE_URL=postgresql://journal:journal@localhost:5432/journal?schema=public
```

**apps/web/.env**

```
VITE_API_URL=/api
```
