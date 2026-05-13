# User Service API

Сервис управления пользователями на Express.js + TypeScript + MongoDB.

## Технологии

- **Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **Passport.js + passport-jwt**
- **bcryptjs**
- **Docker + Docker Compose** 

## Структура проекта

```
src/
├── config/          # Конфигурация приложения
├── middleware/      # Middleware (auth, validators)
├── models/          # Mongoose модели
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
├── types/           # TypeScript типы
├── utils/           # Утилиты (passport, token generator)
└── index.ts         # Точка входа
```

## Модель пользователя

- `fullName` - ФИО
- `dateOfBirth` - Дата рождения
- `email` - Email (уникальный)
- `password` - Пароль (хэшируется)
- `role` - Роль: `admin` или `user`
- `status` - Статус: `active` или `inactive`

## API Endpoints

### 1. Регистрация пользователя
```
POST /api/users/register
Content-Type: application/json

{
  "fullName": "",
  "dateOfBirth": "1999-01-01",
  "email": "",
  "password": ""
}
```

### 2. Авторизация
```
POST /api/users/login
Content-Type: application/json

{
  "email": "",
  "password": ""
}
```

Ответ:
```json
{
  "user": {
    "id": "...",
    "fullName": "...",
    "email": "...",
    "role": "",
    "status": ""
  },
  "token": ""
}
```

### 3. Получение пользователя по ID
```
GET /api/users/:id
Authorization: Bearer <token>
```

**Доступ**: Админ или сам пользователь

### 4. Получение списка всех пользователей
```
GET /api/users
Authorization: Bearer <token>
```

**Доступ**: Только админ

### 5. Блокировка пользователя
```
PATCH /api/users/:id/block
Authorization: Bearer <token>
```

**Доступ**: Админ или сам пользователь

## Запуск проекта

### Через Docker Compose

```bash
docker-compose up --build
```

Сервер будет доступен на `http://localhost:3000`

### Локально

```bash
npm install
docker run -d -p 27017:27017 --name mongodb mongo:7
npm run dev
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| PORT | Порт сервера | 3000 |
| MONGODB_URI | URI подключения к MongoDB | mongodb://mongodb:27017/user-service |
| JWT_SECRET | Секретный ключ для JWT | your-super-secret-jwt-key-change-in-production |
| JWT_EXPIRES_IN | Время жизни токена | 7d |
