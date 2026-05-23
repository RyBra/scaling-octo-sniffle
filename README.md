# Журнал работ

Внутренний инструмент для фиксации выполненных работ на строительных объектах.

## Стек

| Слой | Технологии | Почему |
|------|------------|--------|
| Monorepo | pnpm workspaces + Turborepo | Единая установка зависимостей, параллельный `dev` |
| Backend | Nest.js (DDD), Prisma, PostgreSQL | Явные use cases, типобезопасный доступ к БД |
| Frontend | React, TypeScript, React Query, Zustand, Tailwind, shadcn/ui | Кэш API, лёгкий стейт фильтров, доступные компоненты |

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
