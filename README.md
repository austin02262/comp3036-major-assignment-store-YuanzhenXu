# GameHub - B2C Video Game Store

GameHub is a full-stack B2C video game store built for the COMP3036 Full Stack Development Major Assignment, Option 2. The project extends the existing assignment monorepo into an online store where customers can browse digital games, search and filter products, add games to a cart, complete a mock checkout, and view purchase history. Administrators can manage products and review purchase records.

This project is based on the codebase from the previous COMP3036 Blog Project assignments 2.1, 2.2, and 2.3. The original blog frontend, admin dashboard, database package, tests, and monorepo structure are being modified and extended into a B2C video game store application.

## Applications

| App | URL | Purpose |
| --- | --- | --- |
| `apps/web` | `http://localhost:3001` | Customer storefront |
| `apps/admin` | `http://localhost:3002` | Admin dashboard |

## Project Focus

This store is themed around video games rather than general retail products. Products represent games and include information such as title, description, price, cover image, genre, platform, stock quantity, and release details.

## Planned Core Features

### Customer Storefront

| Feature | Description | Status |
| --- | --- | --- |
| Product catalogue | Display a list of video games with cover image, title, description, price, category, and platform. | Planned |
| Search | Allow customers to search games by title. | Planned |
| Filtering | Filter games by genre/category and platform. | Planned |
| Product details | Show a detailed page for each game. | Planned |
| Shopping cart | Add, remove, and update games before checkout. | Planned |
| Mock checkout | Complete a purchase using a simulated payment flow. | Planned |
| Purchase history | Display previous purchases and order totals. | Planned |

### Admin Dashboard

| Feature | Description | Status |
| --- | --- | --- |
| Admin authentication | Restrict admin pages to logged-in administrators. | Existing base available |
| Product management | Create, update, and delete video game products. | Planned |
| Stock management | Update product stock quantity and availability. | Planned |
| Purchase records | View customer purchase history and order details. | Planned |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API routes |
| Database | Prisma with SQLite for local development |
| Monorepo | pnpm workspaces and Turborepo |
| Testing | Playwright and Vitest |
| CI | GitHub Actions |

## Project Structure

```txt
comp3036-major-assignment-store-YuanzhenXu/
  apps/
    web/                 Customer-facing store application
    admin/               Admin dashboard application
  packages/
    db/                  Shared Prisma database schema and client
    ui/                  Shared UI components
    utils/               Shared utility functions
    env/                 Shared environment configuration
  tests/
    playwright/          End-to-end tests
  .github/
    workflows/           CI pipeline
```

## Database Plan

The current project already uses Prisma. For the store application, the schema will be extended with models similar to:

| Model | Purpose |
| --- | --- |
| `Product` | Stores video game product information. |
| `User` | Stores customer account details. |
| `Purchase` | Stores completed customer orders. |
| `PurchaseItem` | Stores the games included in each purchase. |
| `Category` | Stores product genres/categories such as Action, RPG, Strategy, and Sports. |

## Getting Started

Install dependencies from the project root:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm --filter @repo/db db:generate
```

Push the local database schema:

```bash
pnpm --filter @repo/db db:push
```

Run both applications:

```bash
pnpm dev
```

The storefront runs on `http://localhost:3001`.

The admin dashboard runs on `http://localhost:3002`.

## Testing

The final project will include E2E tests for all newly added store functionality.

Planned E2E coverage:

- Customer can browse the game catalogue.
- Customer can search for a game.
- Customer can filter games by category.
- Customer can add a game to the cart.
- Customer can complete mock checkout.
- Customer can view purchase history.
- Admin can create, edit, and delete products.
- Admin can view purchase records.

Run the existing test pipeline:

```bash
pnpm build
```

```bash
turbo all:test
```

## API Documentation Plan

The final submission will include API documentation for the store endpoints, including:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/products` | Retrieve products with optional search and filters. |
| `GET /api/products/:id` | Retrieve one product. |
| `POST /api/products` | Create a product from the admin dashboard. |
| `PATCH /api/products/:id` | Update a product from the admin dashboard. |
| `DELETE /api/products/:id` | Delete a product from the admin dashboard. |
| `POST /api/checkout` | Create a mock purchase. |
| `GET /api/purchases` | Retrieve purchase history. |

## Major Assignment Context

Course: COMP3036 Full Stack Development

Assignment: Major Assignment, Option 2 - B2C Store Application

Theme: Video game store

Base code: COMP3036 Blog Project assignments 2.1, 2.2, and 2.3

The final submission will include source code, a deployed application URL, E2E tests, a CI pipeline, API documentation, and a short demo video.
