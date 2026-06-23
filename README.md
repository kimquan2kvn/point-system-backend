# Point System Backend

A RESTful API for user authentication and management in an educational point/diploma management system. Built with Fastify, TypeScript, Sequelize ORM, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Fastify](https://fastify.dev/) v4 |
| Language | TypeScript |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Authentication | JWT (`@fastify/jwt`) |
| Password hashing | bcryptjs |

## Architecture

The project follows a clean layered architecture:

```
Routes → Controllers → Services → Repositories → Models
```

```
src/
├── app.ts                    # Application entry point & plugin registration
├── controller/               # Request handlers
├── routes/                   # Endpoint definitions (autoloaded)
├── services/                 # Business logic
├── repositories/             # Data access layer (interface + Sequelize implementation)
├── models/                   # Sequelize model definitions
├── schemas/                  # JSON schemas for request/response validation
├── plugins/                  # Fastify plugins (DB, JWT, CORS)
└── util/enum/                # Shared enumerations
```

## Prerequisites

- Node.js >= 16
- PostgreSQL running locally (default: `localhost:5432`)
- Yarn

## Getting Started

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Configure environment**

   Create a `.env` file in the project root:

   ```env
   PORT=3001
   ```

   > **Note:** Database connection URL and JWT secret are currently hardcoded in `src/plugins/sequelize.ts` and `src/plugins/jwt.ts`. Move them to `.env` before deploying to production.

3. **Start the development server**

   ```bash
   yarn dev
   ```

   The server will start on `http://localhost:3001` with hot-reload enabled.

4. **Build for production**

   ```bash
   yarn build:ts
   yarn start
   ```

## API Reference

### Health Check

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check — returns `{ root: true }` |

### Authentication — `/v1/authen`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v1/authen/register` | No | Register a single user |
| POST | `/v1/authen/login` | No | Login and receive a JWT token |
| POST | `/v1/authen/create-multiple-users` | JWT (admin) | Bulk-create student accounts |
| GET | `/v1/authen/info` | JWT | Get the currently logged-in user's info |

**Register** `POST /v1/authen/register`

```json
// Request body
{ "userName": "sv001", "password": "secret", "name": "Nguyen Van A" }

// Response
{ "id": "uuid", "user_name": "sv001", "name": "Nguyen Van A", "role": 0 }
```

**Login** `POST /v1/authen/login`

```json
// Request body
{ "userName": "sv001", "password": "secret" }

// Response — token expires in 30 minutes
{ "token": "<jwt>" }
```

**Bulk create users** `POST /v1/authen/create-multiple-users`

Requires `Authorization: Bearer <token>` header. Caller must have role `PHONG_DAO_TAO` (1).

```json
// Request body
{ "students": [{ "id": "sv001", "name": "Nguyen Van A" }] }
```

### Users — `/v1/user`

All routes require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| GET | `/v1/user/` | List all users (optional `?role=<number>` filter) |
| PUT | `/v1/user/:id` | Update a user's name or role |
| DELETE | `/v1/user/:id` | Delete a user |

**Update user** `PUT /v1/user/:id`

```json
{ "name": "New Name", "role": 1 }
```

## User Roles

| Value | Constant | Description |
|---|---|---|
| `0` | `SINH_VIEN` | Student — view/request transcript |
| `1` | `PHONG_DAO_TAO` | Education Department — export point data, bulk-create users |
| `2` | `PHONG_KHAO_THI` | Exam Department — import point data |

## Database

**User model schema:**

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `user_name` | STRING | Unique |
| `password` | STRING | bcrypt-hashed (10 rounds) |
| `name` | STRING | Display name |
| `role` | INTEGER | Default `0` (Student) |
| `createdAt` | TIMESTAMP | Auto-managed |
| `updatedAt` | TIMESTAMP | Auto-managed |

In development the schema is synced automatically with `alter: true`. In production, use migrations.

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start with hot-reload (ts-node + watch) |
| `yarn start` | Start compiled output |
| `yarn build:ts` | Compile TypeScript to `dist/` |
| `yarn test` | Run tests with tap |

## Production Checklist

- [ ] Move database connection URL to `DATABASE_URL` env var
- [ ] Move JWT secret to `JWT_SECRET` env var
- [ ] Replace `alter: true` DB sync with proper migrations
- [ ] Restrict CORS `origin` from `true` to explicit allowed origins
- [ ] Set token expiry appropriate for your security policy
