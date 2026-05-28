# GameHub API Documentation

GameHub uses Next.js route handlers as REST-style API endpoints. Customer endpoints live in `apps/web`; admin endpoints live in `apps/admin`.

## Authentication

### Customer Session

Customer login creates a JWT stored in an HTTP-only `customer_session` cookie. Customer purchase endpoints require this cookie.

### Admin Session

Admin login creates a JWT stored in an HTTP-only `auth_token` cookie. Admin product and purchase endpoints require this cookie.

## Customer API

Base URL locally: `http://localhost:3001`

### POST `/api/register`

Creates a customer account.

Request body:

```json
{
  "username": "austin",
  "email": "austin@example.com",
  "password": "password123"
}
```

Validation:

- `username`, `email`, and `password` are required.
- Password must be at least 6 characters.
- Username must not contain `@`.
- Username must be unique.
- Email must be unique.

Success response: `201 Created`

```json
{
  "id": 1,
  "username": "austin",
  "email": "austin@example.com"
}
```

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Missing fields, short password, or username contains `@`. |
| `409` | Username or email already exists. |

### POST `/api/login`

Logs in a registered customer and sets the `customer_session` cookie.

Request body:

```json
{
  "email": "austin@example.com",
  "password": "password123"
}
```

Success response: `200 OK`

```json
{
  "id": 1,
  "username": "austin",
  "email": "austin@example.com"
}
```

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Email or password is missing. |
| `401` | Password is incorrect. |
| `404` | Account has not been registered. |

### POST `/api/logout`

Logs out the current customer by clearing the `customer_session` cookie.

Success response: `200 OK`

```json
{
  "ok": true
}
```

### GET `/api/purchases`

Returns purchase history for the currently logged-in customer only.

Authentication: customer session required.

Success response: `200 OK`

```json
[
  {
    "id": "GH-1710000000000",
    "userId": 1,
    "total": 119.9,
    "createdAt": "2026-05-27T00:00:00.000Z",
    "user": {
      "id": 1,
      "email": "austin@example.com",
      "username": "austin"
    },
    "items": [
      {
        "id": 1,
        "purchaseId": "GH-1710000000000",
        "productId": 102,
        "quantity": 2,
        "unitPrice": 59.95,
        "productTitle": "Halo Infinite",
        "productImageUrl": "/games/halo_header.jpg"
      }
    ]
  }
]
```

Error responses:

| Status | Reason |
| --- | --- |
| `401` | Customer is not logged in. |

### POST `/api/purchases`

Creates a purchase for the currently logged-in customer. The server recalculates the total from database product prices and does not trust the browser total.

Authentication: customer session required.

Request body:

```json
{
  "firstName": "Austin",
  "lastName": "Xu",
  "email": "austin@example.com",
  "phone": "0400000000",
  "address": "1 GameHub Street, Sydney, NSW, 2000",
  "postcode": "2000",
  "items": [
    {
      "productId": 102,
      "quantity": 2
    }
  ]
}
```

Success response: `201 Created`

```json
{
  "id": "GH-1710000000000",
  "total": 119.9,
  "userId": 1,
  "items": [
    {
      "productId": 102,
      "quantity": 2,
      "unitPrice": 59.95,
      "productTitle": "Halo Infinite"
    }
  ]
}
```

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Missing customer/delivery details, empty cart, or unavailable product. |
| `401` | Customer is not logged in. |

## Admin API

Base URL locally: `http://localhost:3002`

### POST `/api/auth`

Logs in an admin user. Accepts either a form request or JSON request.

Request body:

```json
{
  "password": "123"
}
```

Success response for JSON request: `200 OK`

```json
{
  "ok": true
}
```

For form requests, successful login redirects to `/`.

Error responses:

| Status | Reason |
| --- | --- |
| `401` | Invalid admin password for JSON requests. |

### DELETE `/api/auth`

Clears the admin auth cookie.

Success response: `200 OK`

```json
{
  "ok": true
}
```

### GET `/api/logout`

Clears the admin auth cookie and redirects to `/`.

### GET `/api/products`

Returns all products for the admin dashboard, including inactive products.

Authentication: admin session required.

Success response: `200 OK`

```json
[
  {
    "id": 102,
    "urlId": "halo-infinite",
    "title": "Halo Infinite",
    "description": "Flagship Xbox FPS.",
    "price": 59.95,
    "stock": 18,
    "active": true,
    "category": {
      "name": "FPS"
    }
  }
]
```

Error responses:

| Status | Reason |
| --- | --- |
| `401` | Admin is not logged in. |

### POST `/api/products`

Creates a new product.

Authentication: admin session required.

Request body:

```json
{
  "title": "Test Drive Galaxy",
  "description": "A racing game for the admin flow.",
  "content": "Full product details.",
  "imageUrl": "/games/forza_header.jpg",
  "galleryImages": ["/games/forza1.jpg", "/games/forza2.jpg"],
  "category": "Racing",
  "platform": "Xbox",
  "platforms": ["Xbox"],
  "price": 69.95,
  "stock": 5,
  "releaseDate": "2026-07-15",
  "active": true
}
```

Success response: `201 Created`

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Required fields are missing or price/date is invalid. |
| `401` | Admin is not logged in. |

### PUT `/api/products/:id`

Updates editable product fields.

Authentication: admin session required.

Request body uses the same shape as `POST /api/products`.

Success response: `200 OK`

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Invalid product id or invalid price/stock/date. |
| `401` | Admin is not logged in. |
| `404` | Product not found. |

### PATCH `/api/products/:id`

Toggles product availability.

Authentication: admin session required.

Success response: `200 OK`

```json
{
  "id": 102,
  "active": false
}
```

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Invalid product id. |
| `401` | Admin is not logged in. |
| `404` | Product not found. |

### DELETE `/api/products/:id`

Soft-hides a product by setting `active` to `false`. Purchase history remains valid because purchase items still reference the product.

Authentication: admin session required.

Success response: `200 OK`

```json
{
  "ok": true
}
```

Error responses:

| Status | Reason |
| --- | --- |
| `400` | Invalid product id. |
| `401` | Admin is not logged in. |
| `404` | Product not found. |

### GET `/api/purchases`

Returns all customer purchase records for the admin dashboard.

Authentication: admin session required.

Success response: `200 OK`

```json
[
  {
    "id": "GH-1710000000000",
    "total": 119.9,
    "createdAt": "2026-05-27T00:00:00.000Z",
    "user": {
      "email": "austin@example.com"
    },
    "items": [
      {
        "quantity": 2,
        "productTitle": "Halo Infinite"
      }
    ]
  }
]
```

Error responses:

| Status | Reason |
| --- | --- |
| `401` | Admin is not logged in. |
