# Ecommerce App

A full-stack example e-commerce application with a TypeScript backend (Express + Drizzle) and a React + Vite frontend. This repository is intended as a developer-friendly starter for building catalog, cart, and user management features with migrations, seeding, and a clear project structure.

---

## Key Features

- TypeScript throughout: backend and frontend
- Backend: Express-style HTTP API, Drizzle ORM, SQL-based migrations and seeds
- Frontend: React + Vite, modular layout and pages for admin and shop
- Clear separation of concerns: `backend/`, `frontend/`, and `shared/`

---

## Repository Structure

- `backend/` — API server, database config, migrations, controllers, and routes
- `frontend/` — React + Vite SPA (admin and shop layouts)
- `shared/` — DTOs and types shared between front and back-end
- `docs/` — DBML and schema diagrams

---

## Tech Stack

- Backend: Node, TypeScript, Express-like app, Drizzle ORM, PostgreSQL
- Frontend: React, TypeScript, Vite
- Dev tools: ESLint, TypeScript, Vite dev server

---

## Prerequisites

- Node.js >= 18
- npm or yarn (or pnpm)
- A running SQL database (Postgres recommended) for the backend

---

## Environment

The backend expects environment variables for database connection and app configuration. Create a `.env` file in `backend/` (or otherwise provide env vars) with values similar to:

```
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
PORT=4000
JWT_SECRET=your_jwt_secret
```

Adjust names according to your deployment and secrets management.

---

## Setup & Run

Backend

```
cd backend
npm install
npm run migrate
npm run dev
```

Frontend

```
cd frontend
npm install
npm run dev
```

Notes

- If you use `yarn` or `pnpm`, replace `npm install` / `npm run` accordingly.
- Check `backend/package.json` and `frontend/package.json` for the exact scripts available.

---

## Live Demo

- Site: https://grzegorzmarczewski.me/
- Backend database: Neon
- Backend app: Render
- Frontend: Vercel

## Database & Migrations

- Migrations are tracked in `backend/migrations/` and configured via `backend/drizzle.config.ts`.
- To initialize or apply migrations, run the migration commands configured in `backend/package.json` (commonly `npm run migrate` or similar).
- A seed controller and seed scripts are available in `backend/src/db/seed.ts` to populate demo data.

---

## API Overview

This project exposes public and admin routes. Key route groups include:

- Public (no auth required):
    - `GET /products` — list products
    - `GET /products/:id` — product details
    - `GET /categories` — list categories
    - Cart and user endpoints under `publicCarts` and `publicUsers`
    - Auth endpoints under `publicAuth` for login/register

- Admin (requires admin auth):
    - `POST /admin/products` — create product
    - `PUT /admin/products/:id` — update product
    - `DELETE /admin/products/:id` — delete product
    - Category and user management under `adminCategories` and `adminUsers`

Refer to the source route files under `backend/src/routes/` for the full list of routes and controllers.

---

## Development Notes

- Controllers are in `backend/src/controllers/` and group business logic by resource (products, users, categories, carts).
- Middlewares live in `backend/src/middleware/` for auth, admin checks, and request interception.
- Shared DTOs and types are in `shared/dtos.ts` to keep type contracts consistent across client and server.
