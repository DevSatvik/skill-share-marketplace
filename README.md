# Skill Share Marketplace

A full-stack application with separate **backend** and **frontend** folders:

```
skill-share-marketplace/
├── backend/
├── frontend/
├── package.json          # root-level scripts
└── README.md
```

---

## Prerequisites

- **Node.js** v16+ (includes npm)
- **PostgreSQL** (or another DB supported by Prisma)

---

## Pending Tasks 🚧

- [ ] Add **Frontend Tests** (unit & integration)
- [ ] Improve overall **Styling** and **UI/UX** polish

---

## Environment Variables

### Backend (`backend/.env`)

```init
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
PORT=4000        # optional, defaults to 4000
```

*Frontend uses the base URL defined directly in `lib/axios.ts`, so no additional environment variable setup is required.*

---

## Root Scripts

Install root dev dependencies (e.g. `concurrently`):

```bash
npm install
```

### Available commands (run from repo root)

| Script         | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `npm run predev`       | Installs `backend` and `frontend` dependencies               |
| `npm run dev`          | Starts **both** backend and frontend concurrently            |
| `npm run dev-backend`  | Starts backend only (`npm --prefix backend run server`)       |
| `npm run dev-frontend` | Starts frontend only (`npm --prefix frontend run dev`)        |
| `npm run test-backend` | Runs backend tests (`npm --prefix backend run test`)          |

To launch the entire stack:

```bash
npm run dev
```

This will:
1. Install dependencies in `backend` & `frontend` (via `predev`).
2. Start the backend on http://localhost:4000.
3. Start the frontend on http://localhost:3000.

Press **Ctrl+C** to stop both.

---

## Backend Details

For detailed database schema and backend test documentation, see:
- [Database Schema](backend/db/database.md)
- [Backend Tests](backend/tests/README.md)

```
backend/
├── controllers/       # route handlers
├── routes/            # Express routers
├── middleware/        # auth & role checks
├── db/                # database config
├── prisma/            # schema & migrations
├── tests/             # Jest + Supertest suites
├── server.js          # entrypoint
├── swagger.js         # API docs setup
├── package.json       # scripts, dependencies
├── babel.config.cjs
└── jest.config.cjs
```

- **`npm run server`** (alias `dev-backend`) starts the API with `nodemon`.
- **`npm run test`** (via `test-backend`) runs Jest tests in `/tests`.

---

## Frontend Details

```
frontend/
├── app/
│   ├── components/    # shared UI elements
│   ├── context/       # React context for auth
│   ├── hooks/         # custom hooks (e.g. useAxios)
│   ├── lib/           # axios instance, utilities
│   ├── types/         # TS payload/response interfaces
│   ├── login/ register/ ... pages
│   └── layout.tsx
├── public/            # static assets
├── README.md          # FR-specific README (if any)
├── package.json       # scripts, dependencies
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

- **`npm run dev`** (alias `dev-frontend`) starts Next.js on port 3000.
- **`npm run gen:api-types`** regenerates TS types from OpenAPI spec.

---