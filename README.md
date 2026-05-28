# GameHub - B2C Video Game Store

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?logo=playwright)
![pnpm](https://img.shields.io/badge/pnpm-Monorepo-f69220?logo=pnpm)

GameHub is a full-stack Business-to-Consumer video game store built for **COMP3036 - Full Stack Development** (Major Assignment, Option 2). It is a pnpm + Turborepo monorepo with two Next.js applications: a customer storefront and an admin dashboard. Both apps share the same Neon PostgreSQL database through the shared Prisma package.

| App | Local URL | Purpose |
| --- | --- | --- |
| `apps/web` | `http://localhost:3001` | Customer storefront |
| `apps/admin` | `http://localhost:3002` | Admin dashboard |

The project follows the same monorepo pattern used in the course material: application code lives in `apps/`, shared database/config/UI/utilities live in `packages/`, and Playwright E2E tests live in `tests/`.

---

## Live Deployment

| App | URL |
| --- | --- |
| Storefront | https://comp3036-major-assignment-store-yua-seven.vercel.app/ |
| Admin | https://comp3036-major-assignment-store-yua.vercel.app/ |

**Local test credentials**

- Customer: register a new customer from `/register`
- Admin password: `123`
- Mock payment card: `4242424242424242`

---

## Table of Contents

1. [Live Deployment](#live-deployment)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Prerequisites](#prerequisites)
7. [Installation](#installation)
8. [Environment Variables](#environment-variables)
9. [Database Setup](#database-setup)
10. [Running Locally](#running-locally)
11. [Running Tests](#running-tests)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Security](#security)
14. [Storage and Rendering](#storage-and-rendering)
15. [API Documentation](#api-documentation)
16. [Deployment](#deployment)
17. [Monitoring and Logging](#monitoring-and-logging)
18. [Demo Video Checklist](#demo-video-checklist)
19. [Academic Context](#academic-context)

---

## Features

### Customer Storefront (`apps/web`)

| # | Feature | Description |
| --- | --- | --- |
| 1 | **Customer Authentication** | Register, login, and logout with hashed passwords and JWT sessions stored in HTTP-only cookies. |
| 2 | **Product Catalogue** | Browse video games with image, title, description, price, category, platform, stock, and release details. |
| 3 | **Product Filtering & Search** | Search by game title and filter by genre, platform, and release year. |
| 4 | **Product Detail Page** | View detailed product content and a gameplay image gallery. |
| 5 | **Account-Specific Shopping Cart** | Add, remove, and update product quantities. Cart data is stored per logged-in customer and remains after logout/login. |
| 6 | **Mock Checkout** | Complete a simulated payment flow using a 16-digit mock card number. |
| 7 | **Purchase History** | View previous purchases for the currently logged-in account only. |

### Admin Dashboard (`apps/admin`)

| # | Feature | Description |
| --- | --- | --- |
| 8 | **Admin Authentication** | Password-protected admin access using a hashed admin password and a JWT stored in an HTTP-only cookie. |
| 9 | **Dashboard Stats** | View total products, active products, recent orders, and recent revenue. |
| 10 | **Product Management** | Create and edit video game products, including genre, platforms, price, images, release date, and stock. |
| 11 | **Product Availability** | Toggle product status between available and out of stock. Deleting a product soft-hides it by setting `active` to false. |
| 12 | **Purchase Records** | View customer purchase records and line items across all accounts. |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 4 and CSS modules |
| Authentication | Custom credential login, PBKDF2 password hashing, and JWT sessions stored in HTTP-only cookies |
| Database | PostgreSQL hosted on Neon |
| ORM | Prisma 6 |
| Monorepo | Turborepo and pnpm workspaces |
| API Style | REST-style Next.js API routes |
| E2E Tests | Playwright |
| Unit Tests | Vitest |
| CI | GitHub Actions |

---

## Project Structure

```txt
comp3036-major-assignment-store-YuanzhenXu/
  apps/
    web/                         # Customer storefront, port 3001
      src/
        app/
          api/                    # Customer auth and purchase API routes
          cart/                   # Cart page
          checkout/               # Mock checkout and success page
          games/[urlId]/          # Product detail page
          login/                  # Customer login page
          purchases/              # Customer purchase history
          register/               # Customer registration page
          page.tsx                # Storefront home page
        components/
          Layout/                 # Storefront layout and top menu
          Store/                  # Cart, checkout, product grid, game detail
        utils/                    # Customer auth and cart storage helpers
    admin/                       # Admin dashboard, port 3002
      src/
        app/
          api/                    # Admin auth, product, and purchase routes
          product/[urlId]/        # Edit product page
          products/create/        # Create product page
          page.tsx                # Admin dashboard
        components/               # Product form, product list, logout button
        utils/                    # Admin auth helpers
  packages/
    db/                          # Shared Prisma schema, client, seed data
    env/                         # Environment validation helpers
    ui/                          # Shared UI package
    utils/                       # Shared utility functions
  tests/
    playwright/                  # Playwright E2E tests
      tests/
        web/                     # Customer tests
        admin/                   # Admin tests
        auth.setup.ts            # Reset and seed test database
  .github/
    workflows/
      grading.yml                # GitHub Actions CI pipeline
```

---

## Database Schema

Defined in `packages/db/prisma/schema.prisma`.

| Model | Purpose |
| --- | --- |
| `User` | Stores customer account details, username, email, password hash, and delivery details. |
| `Category` | Stores game genres such as Action, RPG, Racing, Adventure, and FPS. |
| `Product` | Stores video game catalogue data, including price, stock, platform, images, release date, and active status. |
| `Purchase` | Stores completed customer orders and total amount. |
| `PurchaseItem` | Stores purchased product line items with price and title snapshots. |

Relationships:

- One `Category` has many `Product` records.
- One `User` has many `Purchase` records.
- One `Purchase` has many `PurchaseItem` records.
- One `Product` can appear in many `PurchaseItem` records.

PostgreSQL was chosen because the store data is relational: products belong to categories, customers make purchases, and each purchase contains line items linked to products.

---

## Prerequisites

- Node.js 18 or later
- pnpm 10
- A Neon PostgreSQL database

Install pnpm globally if needed:

```bash
npm install -g pnpm
```

---

## Installation

```bash
git clone <your-repository-url>
cd comp3036-major-assignment-store-YuanzhenXu
pnpm install
```

---

## Environment Variables

Local env files are ignored by Git.

### `packages/db/.env`

```env
DATABASE_URL="postgresql://..."
```

### `apps/web/.env.local`

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="local-customer-secret"
```

### `apps/admin/.env.local`

```env
DATABASE_URL="postgresql://..."
PASSWORD_HASH="salt:hash"
JWT_SECRET="local-admin-secret"
```

Use the same `DATABASE_URL` for `apps/web` and `apps/admin` so customer orders created in the storefront appear in the admin dashboard.

Generate an admin password hash locally:

```bash
node -e "const crypto=require('crypto');const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.pbkdf2Sync('123',salt,100000,32,'sha256').toString('hex');console.log(`${salt}:${hash}`)"
```

Paste the output into `PASSWORD_HASH`. The app still supports `PASSWORD=123` as a local/test fallback, but deployment should use `PASSWORD_HASH` so no admin password is stored as plain text.

For CI, configure GitHub repository secrets:

| Secret | Purpose |
| --- | --- |
| `DATABASE_URL` | Main Neon PostgreSQL database URL. |
| `TEST_DATABASE_URL` | Recommended separate test database or Neon branch used by Playwright and CI. |

Do not commit real `.env` files. Local env files are ignored by Git, and deployed values should be configured in Vercel/GitHub secrets.

---

## Database Setup

After setting `DATABASE_URL`, run:

```bash
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:push
pnpm --filter @repo/db db:seed
```

What these commands do:

| Command | Purpose |
| --- | --- |
| `db:generate` | Generates the Prisma client. |
| `db:push` | Pushes the Prisma schema to Neon PostgreSQL. |
| `db:seed` | Seeds the initial GameHub game catalogue. |

This project uses `prisma db push` for fast assignment development. Tracked Prisma migrations can be added later for a long-running production project.

Optional Prisma Studio:

```bash
pnpm --filter @repo/db studio
```

---

## Running Locally

Run both apps:

```bash
pnpm dev
```

Run individual apps:

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/admin dev
```

Build all apps:

```bash
pnpm build
```

---

## Running Tests

Type check:

```bash
pnpm turbo check-types
```

Build:

```bash
pnpm turbo build
```

Playwright test groups:

```bash
pnpm turbo test-1
pnpm turbo test-2
pnpm turbo test-3
```

| Command | Tag | Coverage |
| --- | --- | --- |
| `pnpm turbo test-1` | `@a1` | Customer UI: login, registration, catalogue, search, filters, cart, checkout, purchase history. |
| `pnpm turbo test-2` | `@a2` | Admin UI: login, dashboard, product filtering, product management. |
| `pnpm turbo test-3` | `@a3` | Backend/API: customer auth validation, purchase APIs, admin product APIs. |

Playwright resets and seeds the configured test database. Use `TEST_DATABASE_URL` for CI or local E2E runs if you want to keep production data untouched.

---

## CI/CD Pipeline

The GitHub Actions workflow is defined in:

```txt
.github/workflows/grading.yml
```

The workflow:

1. Installs pnpm and Node.js.
2. Installs dependencies.
3. Installs Playwright Chromium.
4. Pushes the Prisma schema to PostgreSQL.
5. Seeds the GameHub product catalogue.
6. Type checks the monorepo.
7. Builds the apps.
8. Runs customer, admin, and backend/API Playwright test groups.

Required GitHub secrets:

```txt
DATABASE_URL
TEST_DATABASE_URL
```

`TEST_DATABASE_URL` is preferred for tests because the setup step clears and reseeds data.

---

## Security

GameHub uses layered security controls appropriate for the assignment scope:

| Area | Implementation |
| --- | --- |
| Customer passwords | Stored as PBKDF2 hashes in `User.passwordHash`; plain text passwords are never stored. |
| Admin password | Deployment should use `PASSWORD_HASH`; local `PASSWORD=123` remains only as a development/test fallback. |
| Sessions | Signed JWTs stored in HTTP-only cookies. |
| Cookie protection | Session cookies use `httpOnly`, `sameSite: "lax"`, short admin expiry, and customer expiry. |
| SQL injection protection | Database access is through Prisma ORM rather than raw SQL string concatenation. |
| Server-side authorization | Customer APIs check the current customer; admin APIs require a valid admin session. |
| XSS protection | React escapes rendered text by default, and the app does not use `dangerouslySetInnerHTML`. |
| Environment secrets | Database URLs, JWT secrets, and admin password hashes stay in env variables, not source code. |

Expected validation errors return user-friendly messages, while unexpected server failures return safe generic responses instead of exposing database or stack details.

---

## Storage and Rendering

GameHub uses storage based on sensitivity:

| Data | Storage |
| --- | --- |
| Authentication state | HTTP-only JWT cookies, readable by the server only. |
| Cart state | Browser `localStorage` using account-specific keys, because cart items are non-sensitive UX data. |
| Purchases and users | Neon PostgreSQL through Prisma. |
| Theme preference | Lightweight browser cookie. |

Server Components fetch product/admin data from Prisma and keep database access on the server. Client Components handle interactive workflows such as cart updates, filters, checkout forms, login/register forms, and admin product forms.

Authenticated pages are dynamically rendered because they depend on cookies and account-specific data. Static assets such as game images are served from each app's `public/` directory, and local fonts are loaded with `next/font/local`.

---

## API Documentation

API documentation is maintained manually in:

```txt
API.md
```

It covers:

- Customer register, login, and logout APIs.
- Customer purchase APIs.
- Admin authentication APIs.
- Admin product management APIs.
- Admin purchase record API.

Mutations are implemented with documented Next.js REST-style API routes rather than Server Actions because the assignment requires a RESTful or tRPC API.

---

## Deployment

Recommended deployment: Vercel + Neon PostgreSQL.

Create two Vercel projects:

| Vercel Project | Root Directory | Purpose |
| --- | --- | --- |
| GameHub Web | `apps/web` | Customer storefront |
| GameHub Admin | `apps/admin` | Admin dashboard |

Recommended Vercel build commands:

| Vercel Project | Build Command |
| --- | --- |
| GameHub Web | `cd ../.. && pnpm turbo build --filter=@repo/web` |
| GameHub Admin | `cd ../.. && pnpm turbo build --filter=@repo/admin` |

Environment variables for both Vercel projects:

```txt
DATABASE_URL
JWT_SECRET
```

Additional admin environment variable:

```txt
PASSWORD_HASH
```

Vercel runs Next.js pages and API routes as managed serverless functions. Neon remains the persistent PostgreSQL database shared by the storefront and admin dashboard.

---

## Monitoring and Logging

The deployed project can be monitored through:

| Source | Purpose |
| --- | --- |
| GitHub Actions logs | CI type checks, builds, database setup, and Playwright test results. |
| Vercel deployment logs | Build failures, deployment status, and runtime function errors. |
| Neon dashboard | Database status, tables, query activity, and connection health. |

For this assignment, external monitoring tools such as Sentry, Datadog, or New Relic are not required. Vercel and GitHub Actions provide enough visibility for deployment and grading.

---

## Demo Video Checklist

The final demo video should show:

1. Customer registration.
2. Customer login.
3. Product browsing, search, and filters.
4. Product detail page and gameplay gallery.
5. Add to cart.
6. Cart persistence after logout/login.
7. Mock checkout.
8. Purchase history limited to the logged-in account.
9. Admin login.
10. Admin product management.
11. Admin purchase records.

---

## Academic Context

**Course:** COMP3036 - Full Stack Development

**Assignment:** Major Assignment - Option 2, B2C Store Application

**Theme:** Video game store

The project continues from the previous COMP3036 assignment monorepo and extends it into a complete B2C store with customer authentication, product browsing, cart management, mock checkout, purchase history, admin product management, E2E tests, CI, API documentation, and deployment preparation.

| Criterion | Weight |
| --- | --- |
| Functionality | 40% |
| Code Quality | 20% |
| UI/UX | 20% |
| Documentation | 10% |
| Creativity and Effort | 10% |
