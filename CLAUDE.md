# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with nodemon hot-reload (src/index.ts)
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled app (dist/src/index.js)

npx prisma generate   # Regenerate Prisma client after schema changes
npx prisma db pull    # Pull schema from existing database
```

No test runner or linter is configured.

## Environment

Requires a `.env` file with:
```
DATABASE_URL="mysql://<user>:<password>@localhost:3306/usersdb"
JWT_SECRET_KEY='<secret>'
```

Server runs on port 8002 by default (configurable via `PORT` env var).

## Architecture

Three-layer architecture: **Router → Service → Repository**

- [src/index.ts](src/index.ts) — Express app entry point; configures CORS, helmet, cookie-parser, body-parser. The CORS `origin` allowlist is hardcoded here — update it when adding a new frontend origin.
- [src/routers/](src/routers/) — Route handlers. [users.router.ts](src/routers/users.router.ts) mounts all `/api/*` user endpoints. Middleware lives in [src/routers/middleware/](src/routers/middleware/).
- [src/services/users.service.ts](src/services/users.service.ts) — Business logic: bcrypt password hashing/comparison, JWT signing, and stripping `password` fields before returning user data.
- [src/repository/users.repository.ts](src/repository/users.repository.ts) — All Prisma DB operations. A single `PrismaClient` instance is created here.
- [src/types/index.ts](src/types/index.ts) — Shared types: `ResponseObj<T>`, `User` interface, `ErrorType` enum.
- [src/types/dto/](src/types/dto/) — `CreateUser` and `UpdateUser` DTOs.
- [src/consts.ts](src/consts.ts) — Exports `PORT` and `JWT_SECRET_KEY` from `process.env`.

## Key Conventions

- All service functions return `ResponseObj<T>` — `{ success: boolean, data?, message?, error? }`. Callers check `response.success` to determine HTTP status.
- `tokenValidation` middleware (in [src/routers/middleware/token.validation.ts](src/routers/middleware/token.validation.ts)) verifies the `userToken` httpOnly cookie and injects `req.userId` (number) for protected routes.
- Passwords are always deleted from user objects before they leave the service layer.
- JWT tokens are stored in an `httpOnly` cookie named `userToken`; login sets it, logout clears it.

## API Endpoints

All routes are prefixed with `/api/users`:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/all` | No | Get all users |
| POST | `/users/register` | No | Create user (Zod-validated) |
| POST | `/users/login` | No | Login, sets `userToken` cookie |
| DELETE | `/users/logout` | No | Clears `userToken` cookie |
| POST | `/users/loaduser` | Yes | Get current user from token |
| PUT | `/users/update/:userId` | Yes | Update user fields |
| DELETE | `/users/delete/:userId` | Yes | Delete user |
