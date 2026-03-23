<div align="center">
  <img width="150" height="150" alt="StudHack Logo" src="studhack-ui/public/assets/brand/rounded_logo_150x150.png" />
  
  <h1>СтудХак</h1>
  
  <p><em>платформа для поиска команд, разработчиков и карьерных мероприятий в хакатон-экосистеме</em></p>

  <a href="https://woodpecker.dev.nachert.art/repos/13">
    <img src="https://woodpecker.dev.nachert.art/api/badges/13/status.svg" alt="status-badge">
  </a>
</div>


## О проекте

Публичные адреса:
- https://студхак.рф
- https://studhack.nachert.art

Пользовательские сценарии:

- регистрация и авторизация;
- личный профиль и публичные профили участников;
- создание и редактирование команд;
- заявки на вступление в команду и их принятие/отклонение;
- каталог мероприятий и подписки на события;
- уведомления по email.

## Стек

- Frontend: Angular 21, TypeScript, Less, Taiga UI, RxJS
- Backend: ASP.NET Core 8, Entity Framework Core 8, Npgsql
- База данных: PostgreSQL
- Инфраструктура: Dockerfiles для UI и API, Swagger

## Структура репозитория

```text
.
├── docs/                       # документация
├── studhack-ui/                # Angular-приложение
│   ├── src/app/core/           # auth, api clients, config, stores
│   ├── src/app/features/       # лендинг, профили, события, команды, уведомления
│   └── docker/                 # runtime-config и nginx для контейнера
└── studhack-api/               # .NET solution
    ├── StudHack.Api/           # Web API
    ├── StudHack.Application/   # прикладные сервисы
    ├── StudHack.Domain/        # доменная модель и абстракции
    ├── StudHack.DataAccess/    # EF Core, миграции, репозитории
    ├── FillDatabase/           # заполнение справочников
    ├── StudHack.MessageSender/ # SMTP-отправка сообщений
    └── StudHack.MessageSenderService/ # фоновые задачи
```

## Требования

- Node.js 22+
- npm 10+
- .NET SDK 8.0
- PostgreSQL
- Docker (опционально)

## Быстрый старт

### 1. Локальный запуск UI

Фронтенд по умолчанию работает в `mock`-режиме, поэтому его можно поднять без API и без PostgreSQL.

```bash
cd studhack-ui
npm ci
npm start
```

После запуска приложение будет доступно на `http://localhost:4200`.

### 2. Локальный запуск API

Нужен инстанс PostgreSQL. Подключение API к нему настраивается через env:

```bash
export ConnectionStrings__Postgres='Host=localhost;Port=5432;Database=studhack;Username=postgres;Password=postgres'
```

Запуск API:

```bash
cd studhack-api
dotnet restore StudHack.Api.sln
dotnet run --project StudHack.Api/StudHack.Api.csproj --launch-profile http
```

Что важно:

- профиль `http` задает `Auth.ApiUrl`, `Auth.Issuer` и `Auth.Audience` - нужны для работы авторизации;
- локально Swagger будет доступен по адресу `http://localhost:5059/swagger`.

Применение миграций:

```bash
curl -X POST http://localhost:5059/api/v1/migrations
```

Заполнение справочников:

```bash
curl -X POST http://localhost:5059/api/v1/parse-data
```

### 3. Подключение UI к локальному API

Чтобы подключить UI к API, нужно поменять конфигурацию в файле
`studhack-ui/public/runtime-config.js` (и не коммитить эти изменения):

```js
window.__STUDHACK_RUNTIME_CONFIG__ = {
  apiMode: 'real',
  apiBaseUrl: 'http://localhost:5059',
  disableNonceCheck: true,
  disableOAuth2StateCheck: true,
};
```

После смены конфигурации нужен перезапуск UI:

```bash
cd studhack-ui
npm start
```

## Конфигурация

### Backend

Основные переменные окружения для API:

| Переменная | Назначение |
| --- | --- |
| `ConnectionStrings__Postgres` | подключение к PostgreSQL |
| `Auth__ApiUrl` / `Auth.ApiUrl` | URL OAuth OIDC сервера |
| `Auth__Issuer` / `Auth.Issuer` | issuer для JWT |
| `Auth__Audience` / `Auth.Audience` | audience для JWT |

Опциональные SMTP-параметры для отправки email:

- `Smtp__Host`
- `Smtp__Port`
- `Smtp__User`
- `Smtp__Email`
- `Smtp__Password`
- `Smtp__UseDefaultCredentials`
- `Smtp__EnableSsl`

### Frontend

Фронтенд читает конфиг из `runtime-config.js`. При запуске через Docker этот файл
заполняется переменными окружения контейнера:

- `STUDHACK_AUTH_ISSUER`
- `STUDHACK_AUTH_CLIENT_ID`
- `STUDHACK_AUTH_CLIENT_SECRET`
- `STUDHACK_API_BASE_URL`
- `STUDHACK_API_MODE`
- `STUDHACK_AUTH_REDIRECT_URI`
- `STUDHACK_AUTH_POST_LOGOUT_REDIRECT_URI`
- `STUDHACK_AUTH_DISABLE_NONCE_CHECK`
- `STUDHACK_AUTH_DISABLE_OAUTH2_STATE_CHECK`

Примечание: текущая интеграция с OAuth OIDC провайдером предполагает использование `clientSecret`
даже для SPA, поэтому он присутствует в конфиге.

## Docker

Для обеих частей проекта есть Dockerfiles:

```bash
docker build -t studhack-ui ./studhack-ui
docker build -t studhack-api ./studhack-api
```

`docker-compose.yml` в репозитории нет, поэтому оркестрировать сервисы нужно отдельно.

## API

Основные эндпоинты:

- `/api/v1/dictionaries`
- `/api/v1/users`
- `/api/v1/teams`
- `/api/v1/team-requests`
- `/api/v1/events`
- `/api/v1/notifications`

Служебные эндпоинты:

- `POST /api/v1/migrations`
- `POST /api/v1/parse-data`

## Архитектура

![Схема компонентов системы](docs/Components.svg)

![Схема базы данных](docs/DB.svg)

Исходники диаграмм лежат в репозитории в формате Draw.io:

- `docs/Components.drawio`
- `docs/DB.drawio`

## Лицензия

Проект распространяется по лицензии MIT. Подробности — в файле `LICENSE`.
