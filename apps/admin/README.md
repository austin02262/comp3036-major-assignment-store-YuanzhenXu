# GameHub Admin Dashboard

This application is the administrator dashboard for the GameHub B2C video game store. It runs as part of the COMP3036 Major Assignment monorepo and is responsible for store management features.

This admin app is based on the previous COMP3036 Blog Project assignments 2.1, 2.2, and 2.3. The existing blog admin codebase is being modified and extended into a product and purchase management dashboard for the video game store.

## Purpose

The admin dashboard will allow authorised administrators to manage the video game catalogue and review customer purchase records.

## Planned Admin Features

| Feature | Description | Status |
| --- | --- | --- |
| Admin login | Restrict dashboard access to authenticated administrators. | Existing base available |
| Product list | View all video games in the store catalogue. | Planned |
| Product create | Add new games with title, description, price, image, category, platform, and stock quantity. | Planned |
| Product update | Edit existing game information. | Planned |
| Product delete | Remove games from the store catalogue. | Planned |
| Purchase records | View completed orders, purchased items, dates, and totals. | Planned |

## Local Development

Run the admin application from the repository root:

```bash
pnpm --filter @repo/admin dev
```

The admin dashboard runs on:

```txt
http://localhost:3002
```

To run both the storefront and admin dashboard together:

```bash
pnpm dev
```

## Related Application

The customer storefront is located in:

```txt
apps/web
```

It runs on:

```txt
http://localhost:3001
```
