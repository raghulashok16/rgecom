# E-Commerce Backend — API Documentation

**Base URL:** `http://localhost:8080`

---

## Access Control Overview

### Authentication

Protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Alternatively, for browser/testing use only (logs a warning server-side):

```
GET /api/products/1?token=<jwt>
```

---

### Endpoint Access Table

| Method | URL | Access |
|--------|-----|--------|
| `POST` | `/api/auth/register` | 🌐 PUBLIC |
| `POST` | `/api/auth/login` | 🌐 PUBLIC |
| `POST` | `/api/auth/logout` | 🌐 PUBLIC |
| `DELETE` | `/api/auth/users` | 🔑 ADMIN |
| `POST` | `/api/seeder/run` | 🌐 PUBLIC |
| `POST` | `/api/seeder/orders` | 🌐 PUBLIC |
| `GET` | `/api/products` | 🌐 PUBLIC |
| `GET` | `/api/products/category/{categoryId}` | 🌐 PUBLIC |
| `GET` | `/api/products/supplier` | 🔒 PROTECTED (SUPPLIER) |
| `GET` | `/api/products/search` | 🔒 PROTECTED |
| `POST` | `/api/products` | 🔑 ADMIN |
| `POST` | `/api/products/supplier` | 🔒 PROTECTED (SUPPLIER) |
| `GET` | `/api/products/{id}` | 🔒 PROTECTED |
| `PUT` | `/api/products/{id}` | 🔒 PROTECTED |
| `DELETE` | `/api/products/{id}` | 🔒 PROTECTED |
| `POST` | `/api/categories` | 🔒 PROTECTED |
| `GET` | `/api/categories/{id}` | 🌐 PUBLIC |
| `GET` | `/api/categories` | 🌐 PUBLIC |
| `PUT` | `/api/categories/{id}` | 🔒 PROTECTED |
| `DELETE` | `/api/categories/{id}` | 🔒 PROTECTED |
| `POST` | `/api/suppliers` | 🔒 PROTECTED |
| `GET` | `/api/suppliers/{id}` | 🔒 PROTECTED |
| `GET` | `/api/suppliers` | 🔒 PROTECTED |
| `PUT` | `/api/suppliers/{id}` | 🔒 PROTECTED |
| `DELETE` | `/api/suppliers/{id}` | 🔒 PROTECTED |
| `POST` | `/api/orders` | 🔒 PROTECTED |
| `GET` | `/api/orders` | 🔒 PROTECTED |
| `GET` | `/api/orders/{id}` | 🔒 PROTECTED |
| `PATCH` | `/api/orders/{id}/status` | 🔒 PROTECTED |
| `DELETE` | `/api/orders/{id}/cancel` | 🔒 PROTECTED |
| `GET` | `/api/orders/admin/all` | 🔒 PROTECTED |
| `GET` | `/api/auth/users` | 🔑 ADMIN / ADMIN_STOCK |
| `GET` | `/api/auth/users/search` | 🔑 ADMIN / ADMIN_STOCK |
| `GET` | `/api/auth/users/filter` | 🔑 ADMIN / ADMIN_STOCK |
| `PATCH` | `/api/auth/users/{id}` | 🔑 ADMIN / ADMIN_STOCK |
| `GET` | `/api/inventory` | 🔑 ADMIN / ADMIN_STOCK |
| `GET` | `/api/inventory/{productId}` | 🔑 ADMIN / ADMIN_STOCK / SUPPLIER |
| `PUT` | `/api/inventory/{productId}` | 🔑 ADMIN / ADMIN_STOCK |
| `POST` | `/api/inventory/{productId}/adjust` | 🔑 ADMIN / ADMIN_STOCK / SUPPLIER |
| `GET` | `/api/inventory/{productId}/movements` | 🔑 ADMIN / ADMIN_STOCK / SUPPLIER |
| `GET` | `/api/admin/users` | 🔑 ADMIN |
| `PUT` | `/api/admin/users/{userId}/roles` | 🔑 ADMIN |
| `PUT` | `/api/admin/users/{userId}/active` | 🔑 ADMIN |
| `PUT` | `/api/admin/products/{productId}/active` | 🔑 ADMIN |
| `PUT` | `/api/admin/categories/{categoryId}/active` | 🔑 ADMIN |
| `PUT` | `/api/admin/suppliers/{supplierId}/active` | 🔑 ADMIN |
| `GET` | `/api/analytics/supplier-performance` | 🔑 ADMIN / ADMIN_STOCK |

---

### Standard Error Response Format

All error responses share this shape:

```json
{
  "status": 404,
  "message": "Product not found with id: 99",
  "timestamp": "2026-03-04T10:20:15"
}
```

**401 Unauthorized — no token (missing Authorization header):**

```json
{
  "status": 401,
  "message": "Unauthorized",
  "timestamp": "2026-03-04T10:20:15"
}
```

**401 Unauthorized — invalid or expired token:**

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/products/1"
}
```

---

---

## 1. Authentication

### 1.1 Register

**`POST /api/auth/register`** — 🌐 PUBLIC

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

| Field | Rules |
|-------|-------|
| `username` | Required. 3–30 characters. |
| `email` | Required. Valid email format. |
| `password` | Required. Minimum 6 characters. |

**Success — `201 Created`:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2026-03-04T10:20:15"
}
```

> New users are automatically set to `active: true` on registration.

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `username` blank or missing | `"Username is required"` |
| `400` | `username` too short or too long | `"Username must be between 3 and 30 characters"` |
| `400` | `email` blank or missing | `"Email is required"` |
| `400` | `email` invalid format | `"Email must be a valid email address"` |
| `400` | `password` blank or missing | `"Password is required"` |
| `400` | `password` too short | `"Password must be at least 6 characters"` |
| `409` | Email already registered | `"Email 'john@example.com' is already registered. Please use a different email."` |
| `409` | Username already taken | `"Username 'john_doe' is already taken. Please choose a different username."` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 1.2 Login

**`POST /api/auth/login`** — 🌐 PUBLIC

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "secret123"
}
```

| Field | Rules |
|-------|-------|
| `username` | Required. |
| `password` | Required. |

**Success — `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "role": "USER"
}
```

**JWT Claims (HS256, 4-day expiry):**

```json
{
  "sub": "john_doe",
  "role": "USER",
  "userId": 1,
  "email": "john@example.com",
  "iat": 1709550015,
  "exp": 1709636415
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `username` or `password` blank | `"Username is required"` / `"Password is required"` |
| `401` | Wrong credentials | `"Invalid username or password"` |
| `401` | Account is inactive | `"Account is inactive. Please contact the administrator."` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 1.3 Logout

**`POST /api/auth/logout`** — 🌐 PUBLIC

No request body required. The server is stateless — the JWT is not invalidated server-side. The client must discard the token from storage.

**Success — `200 OK`:**

```json
{
  "message": "Logout successful"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 1.4 Delete All Users

**`DELETE /api/auth/users`** — 🔑 ADMIN

Deletes all users and their role assignments from the database. No request body required.

**Success — `204 No Content`**

*(Empty response body)*

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `403` | Token valid but not ADMIN role | `"Forbidden"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 1.5 Get All Users

**`GET /api/auth/users`** — 🔑 ADMIN / ADMIN_STOCK

Returns all users except `raghul` with id, username, email, roles, active status, and createdAt.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Success — `200 OK`:**

```json
[
  {
    "id": 2,
    "username": "ram",
    "email": "ram@ecom.com",
    "roles": ["ADMIN_ORDER"],
    "active": true,
    "createdAt": "2026-03-12T10:00:00"
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Does not have ADMIN or ADMIN_STOCK role | `"Forbidden"` |

---

### 1.6 Search Users by Name

**`GET /api/auth/users/search?name={name}`** — 🔑 ADMIN / ADMIN_STOCK

Returns users whose username contains the search term (case-insensitive). Excludes `raghul`.

**Query Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `name` | Yes | Partial username to search |

**Example:** `GET /api/auth/users/search?name=ram`

**Success — `200 OK`:**

```json
[
  {
    "id": 2,
    "username": "ram",
    "email": "ram@ecom.com",
    "roles": ["ADMIN_ORDER"],
    "active": true,
    "createdAt": "2026-03-12T10:00:00"
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Does not have ADMIN or ADMIN_STOCK role | `"Forbidden"` |

---

### 1.7 Filter Users by Role Group

**`GET /api/auth/users/filter?role={roleGroup}&active={true|false}`** — 🔑 ADMIN / ADMIN_STOCK

Returns users filtered by role group and optionally by active status. Excludes `raghul`.

**Query Parameters:**

| Parameter | Required | Values | Description |
|-----------|----------|--------|-------------|
| `role` | Yes | `admin` / `supplier` / `user` | Role group to filter by |
| `active` | No | `true` / `false` | Filter by active status. Omit to return all. |

**Role group mapping:**

| `role` param | Matches roles |
|---|---|
| `admin` | `ADMIN`, `ADMIN_ORDER`, `ADMIN_STOCK` |
| `supplier` | `SUPPLIER` |
| `user` | `USER` |

**Examples:**
```
GET /api/auth/users/filter?role=admin
GET /api/auth/users/filter?role=supplier&active=true
GET /api/auth/users/filter?role=user&active=false
```

**Success — `200 OK`:**

```json
[
  {
    "id": 3,
    "username": "james",
    "email": "james.carter@techsource.com",
    "roles": ["SUPPLIER"],
    "active": true,
    "createdAt": "2026-03-13T10:00:00"
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Does not have ADMIN or ADMIN_STOCK role | `"Forbidden"` |

---

### 1.8 Update User (Active Status + Roles)

**`PATCH /api/auth/users/{id}`** — 🔑 ADMIN / ADMIN_STOCK

Updates a user's active status and role assignments in a single call.

**Request Body:**

```json
{
  "active": true,
  "roles": ["USER", "ADMIN_ORDER"]
}
```

Available roles: `USER`, `SUPPLIER`, `ADMIN_STOCK`, `ADMIN_ORDER`, `ADMIN`

**Success — `200 OK`:**

```json
{
  "id": 2,
  "username": "ram",
  "email": "ram@ecom.com",
  "roles": ["USER", "ADMIN_ORDER"],
  "active": true,
  "createdAt": "2026-03-12T10:00:00"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | Role name not found in DB | `"Role not found: INVALID_ROLE"` |
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Does not have ADMIN or ADMIN_STOCK role | `"Forbidden"` |
| `404` | User ID not found | `"User not found"` |

---


## 2. Products

### Pagination & Sorting

The `GET /api/products`, `GET /api/products/category/{categoryId}`, and `GET /api/products/search` endpoints support the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `int` | `0` | Zero-based page index |
| `size` | `int` | `10` | Number of items per page |
| `sort` | `string` | `asc` | Sort direction: `asc` or `desc` (sorted by **price**) |

Invalid `sort` value returns `400 Bad Request`.

---

### 2.1 Get All Products

**`GET /api/products`** — 🌐 PUBLIC

No request body. No authentication required.

**Example:**

```
GET /api/products?page=0&size=10&sort=asc
```

**Success — `200 OK`:**

```json
{
  "content": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1299.99,
      "categoryId": 1,
      "supplierId": 1,
      "imageUrl": "https://ibb.co/jYSHS27",
      "createdAt": "2026-03-04T10:20:15",
      "active": true,
      "stockQuantity": 30
    },
    {
      "id": 2,
      "name": "Mouse",
      "description": "Wireless optical mouse",
      "price": 29.99,
      "categoryId": null,
      "supplierId": null,
      "imageUrl": null,
      "createdAt": "2026-03-04T10:25:00"
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "size": 10,
  "numberOfElements": 2
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `sort` is not `asc` or `desc` | `"Invalid sort direction. Use 'asc' or 'desc'"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.2 Get Products by Category

**`GET /api/products/category/{categoryId}`** — 🌐 PUBLIC

No authentication required.

**Example:**

```
GET /api/products/category/1?page=0&size=10&sort=desc
```

**Success — `200 OK`:**

```json
{
  "content": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1299.99,
      "categoryId": 1,
      "supplierId": 1,
      "imageUrl": "https://ibb.co/jYSHS27",
      "createdAt": "2026-03-04T10:20:15",
      "active": true,
      "stockQuantity": 30
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "size": 10,
  "numberOfElements": 1
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `sort` is not `asc` or `desc` | `"Invalid sort direction. Use 'asc' or 'desc'"` |
| `404` | Category not found | `"Category not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.3 Get Products by Supplier (Self)

**`GET /api/products/supplier`** — 🔒 PROTECTED (intended for `SUPPLIER` role)

Returns paginated products assigned to the supplier linked to the currently logged-in user. The match is done by email — the logged-in user's email must match a `Supplier` entity's email.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `int` | `0` | Zero-based page index |
| `size` | `int` | `10` | Number of items per page |
| `sort` | `string` | `asc` | Sort by price: `asc` or `desc` |

**Example:**

```
GET /api/products/supplier?page=0&size=10&sort=asc
```

**Success — `200 OK`:**

```json
{
  "content": [
    {
      "id": 1,
      "name": "Xiaomi Redmi Note 13 Smartphone",
      "description": "6.67\" AMOLED display, 108MP camera, 5000mAh battery",
      "price": 14999.00,
      "categoryId": 1,
      "supplierId": 1,
      "imageUrl": "https://i.ibb.co/Zr0N0Py/71-VW8-Lmqq-PL.jpg",
      "createdAt": "2026-03-13T10:00:00"
    }
  ],
  "totalPages": 2,
  "totalElements": 12,
  "size": 10,
  "numberOfElements": 10
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token / invalid token | `"Unauthorized"` |
| `404` | Logged-in user not found | `"User not found: james"` |
| `404` | No supplier entity linked to user's email | `"No supplier account linked to user: james"` |

---

### 2.5 Search Products by Name

**`GET /api/products/search`** — 🔒 PROTECTED

Case-insensitive partial name match. Returns an empty list (not 404) when no products match.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | Yes | — | Search term (partial, case-insensitive) |
| `page` | `int` | No | `0` | Zero-based page index |
| `size` | `int` | No | `10` | Number of items per page |
| `sort` | `string` | No | `asc` | Sort by price: `asc` or `desc` |

**Example — match found:**

```
GET /api/products/search?name=Laptop&page=0&size=10&sort=asc
```

**Success — `200 OK`:**

```json
{
  "content": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1299.99,
      "categoryId": 1,
      "supplierId": 1,
      "imageUrl": "https://ibb.co/jYSHS27",
      "createdAt": "2026-03-04T10:20:15",
      "active": true,
      "stockQuantity": 30
    },
    {
      "id": 3,
      "name": "Laptop Stand",
      "description": "Adjustable aluminium laptop stand",
      "price": 49.99,
      "categoryId": null,
      "supplierId": null,
      "imageUrl": null,
      "createdAt": "2026-03-04T11:00:00"
    }
  ],
  "totalPages": 1,
  "totalElements": 2,
  "size": 10,
  "numberOfElements": 2
}
```

**Example — no results:**

```
GET /api/products/search?name=XYZUnknownProduct
```

**Success — `200 OK`:**

```json
{
  "content": [],
  "totalPages": 0,
  "totalElements": 0,
  "size": 10,
  "numberOfElements": 0
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` query param missing | Spring default 400 (required parameter) |
| `400` | `sort` is not `asc` or `desc` | `"Invalid sort direction. Use 'asc' or 'desc'"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.6 Create Product (Admin)

**`POST /api/products`** — 🔑 ADMIN

> Product is created with `active: true` automatically. `supplierId` must be provided explicitly.

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1299.99,
  "categoryId": 1,
  "supplierId": 1,
  "imageUrl": "https://ibb.co/jYSHS27"
}
```

| Field | Rules |
|-------|-------|
| `name` | Required. Cannot be blank. |
| `description` | Optional. |
| `price` | Required. Must be greater than `0`. |
| `categoryId` | Optional. Must reference an existing category. |
| `supplierId` | Optional. Must reference an existing supplier. |
| `imageUrl` | Optional. URL string for the product image. |

**Success — `201 Created`:**

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1299.99,
  "categoryId": 1,
  "supplierId": 1,
  "imageUrl": "https://ibb.co/jYSHS27",
  "createdAt": "2026-03-04T10:20:15",
  "active": true,
  "stockQuantity": 30
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` blank or missing | `"Name is required"` |
| `400` | `price` missing | `"Price is required"` |
| `400` | `price` zero or negative | `"Price must be greater than 0"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `403` | Does not have ADMIN role | `"Forbidden"` |
| `404` | `categoryId` not found | `"Category not found with id: 99"` |
| `404` | `supplierId` not found | `"Supplier not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.7 Create Product (Supplier)

**`POST /api/products/supplier`** — 🔒 PROTECTED (SUPPLIER role)

> `supplierId` is resolved automatically from the JWT token — do **not** send it in the body. Product is created with `active: false` (pending admin approval).

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Xiaomi Redmi Note 13 Smartphone",
  "description": "6.67\" AMOLED display, 108MP camera",
  "price": 14999,
  "categoryId": 1,
  "imageUrl": "https://i.ibb.co/Zr0N0Py/71-VW8-Lmqq-PL.jpg"
}
```

| Field | Rules |
|-------|-------|
| `name` | Required. Cannot be blank. |
| `description` | Optional. |
| `price` | Required. Must be greater than `0`. |
| `categoryId` | Optional. Must reference an existing category. |
| `imageUrl` | Optional. |
| `supplierId` | **Ignored** — auto-set from JWT. |

**Success — `201 Created`:**

```json
{
  "id": 70,
  "name": "Xiaomi Redmi Note 13 Smartphone",
  "description": "6.67\" AMOLED display, 108MP camera",
  "price": 14999.00,
  "categoryId": 1,
  "supplierId": 1,
  "imageUrl": "https://i.ibb.co/Zr0N0Py/71-VW8-Lmqq-PL.jpg",
  "active": false,
  "stockQuantity": 0,
  "createdAt": "2026-03-16T10:00:00"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `403` | Does not have SUPPLIER role | `"Forbidden"` |
| `404` | User not found | `"User not found: james"` |
| `404` | No supplier entity linked to user's email | `"No supplier account linked to user: james"` |
| `404` | `categoryId` not found | `"Category not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.9 Get Product by ID

**`GET /api/products/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
GET /api/products/1
```

**Success — `200 OK`:**

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1299.99,
  "categoryId": 1,
  "supplierId": 1,
  "imageUrl": "https://ibb.co/jYSHS27",
  "createdAt": "2026-03-04T10:20:15",
  "active": true,
  "stockQuantity": 30
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Product not found | `"Product not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.10 Update Product

**`PUT /api/products/{id}`** — 🔒 PROTECTED

Full replacement update. To remove a category or supplier, pass `null` for the respective ID field.

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Laptop Pro",
  "description": "Updated high-performance laptop with 32GB RAM",
  "price": 1499.99,
  "categoryId": 1,
  "supplierId": null,
  "imageUrl": "https://ibb.co/JWRmt18J"
}
```

**Success — `200 OK`:**

```json
{
  "id": 1,
  "name": "Laptop Pro",
  "description": "Updated high-performance laptop with 32GB RAM",
  "price": 1499.99,
  "categoryId": 1,
  "supplierId": null,
  "imageUrl": "https://ibb.co/JWRmt18J",
  "createdAt": "2026-03-04T10:20:15",
  "active": true,
  "stockQuantity": 30
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` blank or missing | `"Name is required"` |
| `400` | `price` missing | `"Price is required"` |
| `400` | `price` zero or negative | `"Price must be greater than 0"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Product not found | `"Product not found with id: 99"` |
| `404` | `categoryId` not found | `"Category not found with id: 99"` |
| `404` | `supplierId` not found | `"Supplier not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 2.11 Delete Product

**`DELETE /api/products/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
DELETE /api/products/1
```

**Success — `204 No Content`**

*(Empty response body)*

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Product not found | `"Product not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

---

## 3. Categories

GET endpoints for categories are public. POST, PUT, DELETE require authentication.

---

### 3.1 Create Category

**`POST /api/categories`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

| Field | Rules |
|-------|-------|
| `name` | Required. Cannot be blank. |
| `description` | Optional. |

**Success — `201 Created`:**

```json
{
  "id": 1,
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "createdAt": "2026-03-04T10:20:15"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` blank or missing | `"Name is required"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 3.2 Get Category by ID

**`GET /api/categories/{id}`** — 🌐 PUBLIC

No authentication required.

**Example:**

```
GET /api/categories/1
```

**Success — `200 OK`:**

```json
{
  "id": 1,
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "createdAt": "2026-03-04T10:20:15"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `404` | Category not found | `"Category not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 3.3 Get All Categories

**`GET /api/categories`** — 🌐 PUBLIC

No authentication required.

**Success — `200 OK`:**

```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "createdAt": "2026-03-04T10:20:15"
  },
  {
    "id": 2,
    "name": "Books",
    "description": "Educational and leisure books",
    "createdAt": "2026-03-04T10:25:00"
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 3.4 Update Category

**`PUT /api/categories/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Electronics & Gadgets",
  "description": "Electronic devices, gadgets, and accessories"
}
```

**Success — `200 OK`:**

```json
{
  "id": 1,
  "name": "Electronics & Gadgets",
  "description": "Electronic devices, gadgets, and accessories",
  "createdAt": "2026-03-04T10:20:15"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` blank or missing | `"Name is required"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Category not found | `"Category not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 3.5 Delete Category

**`DELETE /api/categories/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
DELETE /api/categories/1
```

**Success — `204 No Content`**

*(Empty response body)*

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Category not found | `"Category not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

---

## 4. Suppliers

All supplier endpoints require authentication.

---

### 4.1 Create Supplier

**`POST /api/suppliers`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "categoryId": 1,
  "name": "TechSupply Co.",
  "contactPerson": "John Doe",
  "phone": "555-1234",
  "email": "contact@techsupply.com",
  "address": "123 Tech Street, Silicon Valley, CA"
}
```

| Field | Rules |
|-------|-------|
| `categoryId` | Optional. Must reference an existing category. |
| `name` | Required. Cannot be blank. |
| `contactPerson` | Optional. |
| `phone` | Optional. |
| `email` | Optional. Must be valid email format if provided. |
| `address` | Optional. |

**Success — `201 Created`:**

```json
{
  "id": 1,
  "categoryId": 1,
  "name": "TechSupply Co.",
  "contactPerson": "John Doe",
  "phone": "555-1234",
  "email": "contact@techsupply.com",
  "address": "123 Tech Street, Silicon Valley, CA",
  "createdAt": "2026-03-04T10:20:15"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` blank or missing | `"Name is required"` |
| `400` | `email` invalid format | `"Invalid email format"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 4.2 Get Supplier by ID

**`GET /api/suppliers/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
GET /api/suppliers/1
```

**Success — `200 OK`:**

```json
{
  "id": 1,
  "categoryId": 1,
  "name": "TechSupply Co.",
  "contactPerson": "John Doe",
  "phone": "555-1234",
  "email": "contact@techsupply.com",
  "address": "123 Tech Street, Silicon Valley, CA",
  "createdAt": "2026-03-04T10:20:15"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Supplier not found | `"Supplier not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 4.3 Get All Suppliers

**`GET /api/suppliers`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Success — `200 OK`:**

```json
[
  {
    "id": 1,
    "categoryId": 1,
    "name": "TechSupply Co.",
    "contactPerson": "John Doe",
    "phone": "555-1234",
    "email": "contact@techsupply.com",
    "address": "123 Tech Street, Silicon Valley, CA",
    "createdAt": "2026-03-04T10:20:15"
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 4.4 Update Supplier

**`PUT /api/suppliers/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "categoryId": 2,
  "name": "TechSupply International",
  "contactPerson": "Jane Smith",
  "phone": "555-5678",
  "email": "jane@techsupply.com",
  "address": "456 Innovation Ave, San Francisco, CA"
}
```

**Success — `200 OK`:**

```json
{
  "id": 1,
  "categoryId": 2,
  "name": "TechSupply International",
  "contactPerson": "Jane Smith",
  "phone": "555-5678",
  "email": "jane@techsupply.com",
  "address": "456 Innovation Ave, San Francisco, CA",
  "createdAt": "2026-03-04T10:20:15"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `name` blank or missing | `"Name is required"` |
| `400` | `email` invalid format | `"Invalid email format"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Supplier not found | `"Supplier not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 4.5 Delete Supplier

**`DELETE /api/suppliers/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
DELETE /api/suppliers/1
```

**Success — `204 No Content`**

*(Empty response body)*

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Supplier not found | `"Supplier not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

---

## 5. Orders

All order endpoints require authentication.

---

### 5.1 Create Order

**`POST /api/orders`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "items": [
    { "productId": 10, "quantity": 2 },
    { "productId": 15, "quantity": 1 }
  ]
}
```

> The authenticated user is resolved from the JWT token — no `userId` needed in the body.

| Field | Rules |
|-------|-------|
| `customerName` | Optional. |
| `customerEmail` | Optional. |
| `items` | Required. List of products and quantities. |
| `items[].productId` | Required. Must reference an existing product. |
| `items[].quantity` | Required. |

**Success — `201 Created`:**

```json
{
  "id": 12,
  "orderNumber": "ORD-20260301-0012",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "totalAmount": 249.99,
  "status": "ORDERED",
  "createdAt": "2026-03-01T10:00:00",
  "items": [
    {
      "id": 1,
      "productId": 10,
      "productName": "Wireless Noise-Cancelling Headphones",
      "quantity": 2,
      "price": 124.99
    }
  ],
  "timeline": {
    "orderedAt":      "01/03/2026",
    "paymentAt":      null,
    "confirmationAt": null,
    "deliveryAt":     null
  }
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | Product has no stock | `"Out of stock: Xiaomi Redmi Note 13 Smartphone"` |
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Authenticated user not found | `"User not found: john_doe"` |
| `404` | `productId` not found | `"Product not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 5.2 Get Orders by User

**`GET /api/orders`** — 🔒 PROTECTED

> The authenticated user is resolved from the JWT token — no query params needed.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
GET /api/orders
```

**Success — `200 OK`:**

```json
[
  {
    "id": 12,
    "orderNumber": "ORD-20260301-0012",
    "firstItemName": "Wireless Noise-Cancelling H...",
    "extraItemsCount": 0,
    "totalAmount": 249.99,
    "status": "PAYMENT",
    "timeline": {
      "orderedAt":      "01/03/2026",
      "paymentAt":      "01/03/2026",
      "confirmationAt": null,
      "deliveryAt":     null
    }
  },
  {
    "id": 11,
    "orderNumber": "ORD-20260306-0011",
    "firstItemName": "Badminton Racket Set — 2 ...",
    "extraItemsCount": 1,
    "totalAmount": 99.98,
    "status": "CANCELLED",
    "timeline": {
      "orderedAt":      null,
      "paymentAt":      null,
      "confirmationAt": null,
      "deliveryAt":     null,
      "cancelledAt":    "06/03/2026"
    }
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | User not found | `"User not found: john_doe"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 5.3 Get Order by ID

**`GET /api/orders/{id}`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
GET /api/orders/12
```

**Success — `200 OK`:**

```json
{
  "id": 12,
  "orderNumber": "ORD-20260301-0012",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "totalAmount": 249.99,
  "status": "PAYMENT",
  "createdAt": "2026-03-01T10:00:00",
  "items": [
    {
      "id": 1,
      "productId": 10,
      "productName": "Wireless Noise-Cancelling Headphones",
      "quantity": 2,
      "price": 124.99
    }
  ],
  "timeline": {
    "orderedAt":      "01/03/2026",
    "paymentAt":      "01/03/2026",
    "confirmationAt": null,
    "deliveryAt":     null
  }
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Order not found | `"Order not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 5.4 Update Order Status

**`PATCH /api/orders/{id}/status`** — 🔒 PROTECTED

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "DELIVERED"
}
```

| Field | Rules |
|-------|-------|
| `status` | Required. One of: `ORDERED`, `PAYMENT`, `CONFIRMED`, `DELIVERED`, `CANCELLED`. |

**Timeline behaviour by status:**

| Status | Timeline effect |
|--------|----------------|
| `ORDERED` | No new timestamps set |
| `PAYMENT` | `paymentAt` set to now |
| `CONFIRMED` | `confirmationAt` set to now |
| `DELIVERED` | `deliveryAt` set to now |
| `CANCELLED` | All timestamps cleared; `cancelledAt` set to now; stock restored for each item |

**Success — `200 OK`:**

```json
{
  "id": 12,
  "orderNumber": "ORD-20260301-0012",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "totalAmount": 249.99,
  "status": "DELIVERED",
  "createdAt": "2026-03-01T10:00:00",
  "items": [ "..." ],
  "timeline": {
    "orderedAt":      "01/03/2026",
    "paymentAt":      "01/03/2026",
    "confirmationAt": "03/03/2026",
    "deliveryAt":     "06/03/2026"
  }
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Order not found | `"Order not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 5.5 Cancel Order

**`DELETE /api/orders/{id}/cancel`** — 🔒 PROTECTED

Sets the order status to `CANCELLED`, clears all timeline timestamps except `cancelledAt`, and restores inventory stock for each order item. A `StockMovement` record with `movementType = IN` and `referenceType = "ORDER_CANCEL"` is created per item.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
DELETE /api/orders/11/cancel
```

**Success — `200 OK`:**

```json
{
  "id": 11,
  "orderNumber": "ORD-20260306-0011",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "totalAmount": 99.98,
  "status": "CANCELLED",
  "createdAt": "2026-03-06T09:00:00",
  "items": [ "..." ],
  "timeline": {
    "orderedAt":      null,
    "paymentAt":      null,
    "confirmationAt": null,
    "deliveryAt":     null,
    "cancelledAt":    "06/03/2026"
  }
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `404` | Order not found | `"Order not found with id: 99"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 5.6 Get All Orders (Admin)

**`GET /api/orders/admin/all`** — 🔒 PROTECTED

Returns a paginated list of all orders. Optionally filter by status.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | `string` | No | — | Filter by status: `ORDERED`, `PAYMENT`, `CONFIRMED`, `DELIVERED`, `CANCELLED` |
| `date` | `string` | No | — | Filter by exact date (`yyyy-MM-dd`). Takes priority over `month`/`year`. |
| `month` | `int` | No | — | Filter by month (1–12). Must be combined with `year`. |
| `year` | `int` | No | — | Filter by year (e.g. `2026`). Must be combined with `month`. |
| `page` | `int` | No | `0` | Zero-based page index |
| `size` | `int` | No | `10` | Number of items per page |

**Examples:**

```
GET /api/orders/admin/all?status=ORDERED&page=0&size=10
GET /api/orders/admin/all?date=2026-03-01
GET /api/orders/admin/all?month=3&year=2026&status=DELIVERED
```

**Success — `200 OK`:**

```json
{
  "content": [
    {
      "id": 12,
      "orderNumber": "ORD-20260301-0012",
      "username": "john",
      "firstItemName": "Wireless Noise-Cancelling H...",
      "extraItemsCount": 0,
      "totalAmount": 249.99,
      "status": "ORDERED",
      "orderedAt": "01/03/2026",
      "timeline": {
        "orderedAt":      "01/03/2026",
        "paymentAt":      null,
        "confirmationAt": null,
        "deliveryAt":     null
      }
    }
  ],
  "totalElements": 50,
  "totalPages": 5,
  "size": 10,
  "number": 0
}
```

| Field | Description |
|-------|-------------|
| `username` | Username of the user who placed the order. Always present. |
| `orderedAt` | Formatted date string (`dd/MM/yyyy`). `null` for CANCELLED orders. |
| `firstItemName` | Name of the first order item, truncated to 30 chars with `...` if longer. |
| `extraItemsCount` | Number of additional items beyond the first (`items.size() - 1`). |

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token provided | `"Unauthorized"` |
| `401` | Token invalid or expired | `"Invalid or expired token"` |
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

---

---

## 6. Admin

> All `/api/admin/**` endpoints require a valid JWT token for a user with the **`ADMIN`** role. Any other authenticated user receives `403 Forbidden`.

---

### 6.1 Get All Users

**`GET /api/admin/users`** — 🔑 ADMIN

Returns all users **except `raghul`** with their username, email, and active status.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Success — `200 OK`:**

```json
[
  {
    "id": 2,
    "username": "john",
    "email": "john@example.com",
    "active": false
  },
  {
    "id": 3,
    "username": "priya",
    "email": "priya@example.com",
    "active": true
  }
]
```

---

### 6.2 Set User Roles

**`PUT /api/admin/users/{userId}/roles`** — 🔑 ADMIN

Replaces all existing roles of the user with the provided list.

**Request Body:**

```json
{
  "roles": ["ADMIN_STOCK", "ADMIN_ORDER"]
}
```

Available roles: `USER`, `SUPPLIER`, `ADMIN_STOCK`, `ADMIN_ORDER`, `ADMIN`

**Success — `200 OK`:**

```json
{
  "userId": 2,
  "username": "john",
  "rolesAssigned": ["ADMIN_STOCK", "ADMIN_ORDER"]
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | Role name not found in DB | `"Role not found: INVALID_ROLE"` |
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Does not have ADMIN role | `"Forbidden"` |
| `404` | User ID not found | `"User not found"` |

---

### 6.3 Approve / Deactivate User

**`PUT /api/admin/users/{userId}/active`** — 🔑 ADMIN

**Request Body:**

```json
{ "active": true }
```

**Success — `200 OK`:**

```json
{
  "userId": 2,
  "username": "john",
  "active": true
}
```

---

### 6.4 Set Product Active Status

**`PUT /api/admin/products/{productId}/active`** — 🔑 ADMIN

**Request Body:**

```json
{ "active": false }
```

**Success — `200 OK`:**

```json
{
  "productId": 5,
  "name": "Dell Inspiron 15 Laptop",
  "active": false
}
```

---

### 6.5 Set Category Active Status

**`PUT /api/admin/categories/{categoryId}/active`** — 🔑 ADMIN

**Request Body:**

```json
{ "active": false }
```

**Success — `200 OK`:**

```json
{
  "categoryId": 1,
  "name": "Electronics",
  "active": false
}
```

---

### 6.6 Set Supplier Active Status

**`PUT /api/admin/suppliers/{supplierId}/active`** — 🔑 ADMIN

**Request Body:**

```json
{ "active": false }
```

**Success — `200 OK`:**

```json
{
  "supplierId": 3,
  "name": "FastTrack Supply Co.",
  "active": false
}
```

---

## 7. Inventory

> Inventory records are created automatically with `quantity: 0` whenever a product is created via any endpoint. Seeder data uses pre-filled quantities.

---

### 7.1 Get All Inventory

**`GET /api/inventory`** — 🔑 ADMIN / ADMIN_STOCK

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success — `200 OK`:**
```json
[
  {
    "id": 1,
    "productId": 1,
    "productName": "Xiaomi Redmi Note 13 Smartphone",
    "quantity": 30,
    "warehouseLocation": null,
    "lastUpdated": "2026-03-16T10:00:00"
  }
]
```

---

### 7.2 Get Inventory by Product

**`GET /api/inventory/{productId}`** — 🔑 ADMIN / ADMIN_STOCK / SUPPLIER

**Success — `200 OK`:**
```json
{
  "id": 1,
  "productId": 1,
  "productName": "Xiaomi Redmi Note 13 Smartphone",
  "quantity": 30,
  "warehouseLocation": null,
  "lastUpdated": "2026-03-16T10:00:00"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `404` | No inventory record for product | `"Inventory not found for product id: 99"` |

---

### 7.3 Update Stock

**`PUT /api/inventory/{productId}`** — 🔑 ADMIN / ADMIN_STOCK

**Request Body:**
```json
{
  "quantity": 50,
  "warehouseLocation": "Warehouse A, Shelf 3"
}
```

| Field | Rules |
|-------|-------|
| `quantity` | Optional. Must be `>= 0`. |
| `warehouseLocation` | Optional. Free-text string. |

**Success — `200 OK`:**
```json
{
  "id": 1,
  "productId": 1,
  "productName": "Xiaomi Redmi Note 13 Smartphone",
  "quantity": 50,
  "warehouseLocation": "Warehouse A, Shelf 3",
  "lastUpdated": "2026-03-16T12:30:00"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `quantity` is negative | `"Quantity cannot be negative"` |
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Insufficient role | `"Forbidden"` |
| `404` | No inventory record for product | `"Inventory not found for product id: 99"` |

### 7.4 Adjust Stock

**`POST /api/inventory/{productId}/adjust`** — 🔑 ADMIN / ADMIN_STOCK / SUPPLIER

Adjusts inventory quantity and records a stock movement with `referenceType = "ADJUSTMENT"`.

**Request Body:**
```json
{
  "movementType": "IN",
  "quantity": 50
}
```

| Field | Rules |
|-------|-------|
| `movementType` | Required. One of `IN`, `OUT`, `ADJUSTMENT`. |
| `quantity` | Required. Must be `>= 1`. |

**Movement Type Behaviour:**

| `movementType` | Effect on stock |
|----------------|-----------------|
| `IN` | Adds quantity to current stock |
| `OUT` | Subtracts quantity from current stock |
| `ADJUSTMENT` | Sets stock to the exact quantity provided |

**Success — `200 OK`:**
```json
{
  "id": 1,
  "productId": 1,
  "productName": "Xiaomi Redmi Note 13 Smartphone",
  "quantity": 52,
  "warehouseLocation": "Warehouse A, Ambattur Industrial Estate, Chennai, Tamil Nadu",
  "lastUpdated": "2026-03-16T14:00:00"
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | `movementType` is missing | `"Movement type is required"` |
| `400` | `quantity` is missing or zero | `"Quantity must be at least 1"` |
| `400` | `OUT` with insufficient stock | `"Insufficient stock. Available: 2"` |
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Insufficient role | `"Forbidden"` |
| `404` | No inventory record for product | `"Inventory not found for product id: 99"` |

---

### 7.4 Get Stock Movements by Product

**`GET /api/inventory/{productId}/movements`** — 🔑 ADMIN / ADMIN_STOCK / SUPPLIER

Returns all stock movements for the specified product, sorted by date descending (newest first).

**Success — `200 OK`:**
```json
[
  {
    "id": 42,
    "productId": 1,
    "movementType": "IN",
    "quantity": 50,
    "referenceType": "RESTOCK",
    "referenceId": null,
    "movementDate": "2026-03-16T14:30:00"
  },
  {
    "id": 38,
    "productId": 1,
    "movementType": "OUT",
    "quantity": 2,
    "referenceType": "ORDER",
    "referenceId": 17,
    "movementDate": "2026-03-15T10:12:00"
  }
]
```

| Field | Description |
|-------|-------------|
| `movementType` | `IN`, `OUT`, or `ADJUSTMENT` |
| `referenceType` | `ORDER`, `ORDER_CANCEL`, `RESTOCK`, or `ADJUSTMENT` |
| `referenceId` | Order ID for ORDER / ORDER_CANCEL types; `null` for RESTOCK / ADJUSTMENT |

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Insufficient role | `"Forbidden"` |

---

## 8. Seeder

### 6.1 Run Data Seeder

**`POST /api/seeder/run`** — 🌐 PUBLIC

Seeds the database with a fixed set of demo data in one transaction:

- **6 suppliers** (TechSource Global, Prime Distributors, FastTrack Supply Co., GreenLeaf Wholesale, BlueStar Imports, Apex Trading LLC)
- **5 categories** (Electronics, Clothing, Home & Garden, Sports & Fitness, Books & Media)
- **Products with image URLs only** → 69 products total (15 per category except Clothing which has 9 — 6 removed due to missing image URLs), each assigned a supplier (round-robin across the 6 suppliers)

No request body required. Safe to call on an empty database; calling it multiple times will insert duplicate data — it is **not idempotent**.

**Success — `200 OK`:**

```json
{
  "message": "Database seeded successfully",
  "suppliersCreated": 6,
  "categoriesCreated": 5,
  "productsCreated": 69
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

### 8.2 Seed Orders

**`POST /api/seeder/orders`** — 🌐 PUBLIC

Seeds dummy orders for all 6 users (john, alex, sara, mike, lisa, raghul) spread from **Jan 2025 to Mar 2026**. Must be called **after** `/api/seeder/run` and the user seeders.

- **36 orders total** — 6 per user
- **Status mix:** DELIVERED, CONFIRMED, PAYMENT, ORDERED, CANCELLED
- **Full order timelines** set (paymentAt, confirmationAt, deliveryAt, cancelledAt)
- **OUT stock movements** recorded per order item (`referenceType: "ORDER"`)
- **IN stock movements** for cancelled order items (`referenceType: "ORDER_CANCEL"`)
- **14 inward RESTOCK movements** inserted at realistic low-stock points across the period (`referenceType: "RESTOCK"`)
- **Inventory quantities** adjusted to reflect all historical orders and restocks
- **All timestamps backdated** to match historical dates
- **Idempotent** — skips silently if orders already exist or products/users are not found

No request body required.

**Success — `200 OK` (first run):**

```json
{
  "message": "Orders seeded successfully",
  "ordersCreated": 36
}
```

**Success — `200 OK` (already seeded):**

```json
{
  "message": "Orders already seeded or products/users not found",
  "ordersCreated": 0
}
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `500` | Unexpected server error | `"An unexpected error occurred. Please try again later."` |

---

> **Note:** Default roles (`USER`, `SUPPLIER`, `ADMIN_STOCK`, `ADMIN_ORDER`, `ADMIN`) and the following users are seeded automatically on application startup — no endpoint call needed:
> - `raghul` / `rg@gmail.com` — `USER`, `ADMIN`
> - `ram` / `ram@ecom.com` — `ADMIN_ORDER`
> - `nirav` / `nirav@ecom.com` — `ADMIN_STOCK`
> - `mani` / `mani@ecom.com` — `SUPPLIER`
> - `sase` / `sase@ecom.com` — `SUPPLIER`

---

## 8. Quick Reference — cURL Examples

### Auth

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"secret123"}'

# Logout
curl -X POST http://localhost:8080/api/auth/logout

# Delete all users (ADMIN only)
curl -X DELETE http://localhost:8080/api/auth/users \
  -H "Authorization: Bearer <token>"
```

### Seeder

```bash
# Seed suppliers, categories, and products
curl -X POST http://localhost:8080/api/seeder/run

# Seed dummy orders (run after /run and user seeders)
curl -X POST http://localhost:8080/api/seeder/orders
```

### Products (Public)

```bash
# Get all products (paginated)
curl "http://localhost:8080/api/products?page=0&size=10&sort=asc"

# Get products by category
curl "http://localhost:8080/api/products/category/1?page=0&size=10&sort=desc"
```

### Products (Protected)

```bash
# Search products by name (partial, case-insensitive)
curl "http://localhost:8080/api/products/search?name=Laptop&page=0&size=10&sort=asc" \
  -H "Authorization: Bearer <token>"

# Get product by ID
curl http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer <token>"

# Create product
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"16GB RAM","price":1299.99,"categoryId":1,"supplierId":1}'

# Update product (supplierId null removes the supplier)
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Pro","description":"32GB RAM","price":1499.99,"categoryId":1,"supplierId":null}'

# Delete product
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer <token>"
```

### Categories

```bash
# Get all (PUBLIC — no token needed)
curl http://localhost:8080/api/categories

# Get by ID (PUBLIC — no token needed)
curl http://localhost:8080/api/categories/1

# Create
curl -X POST http://localhost:8080/api/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","description":"Electronic devices and accessories"}'

# Update
curl -X PUT http://localhost:8080/api/categories/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics & Gadgets","description":"Updated description"}'

# Delete
curl -X DELETE http://localhost:8080/api/categories/1 \
  -H "Authorization: Bearer <token>"
```

### Orders

```bash
# Create order
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John Doe","customerEmail":"john@example.com","items":[{"productId":10,"quantity":2}]}'

# Get orders for authenticated user
curl http://localhost:8080/api/orders \
  -H "Authorization: Bearer <token>"

# Get order by ID
curl http://localhost:8080/api/orders/12 \
  -H "Authorization: Bearer <token>"

# Update order status
curl -X PATCH http://localhost:8080/api/orders/12/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"DELIVERED"}'

# Cancel order
curl -X DELETE http://localhost:8080/api/orders/12/cancel \
  -H "Authorization: Bearer <token>"

# Get all orders - admin (optional status filter)
curl "http://localhost:8080/api/orders/admin/all?status=ORDERED&page=0&size=10" \
  -H "Authorization: Bearer <token>"
```

### Suppliers

```bash
# Get all
curl http://localhost:8080/api/suppliers \
  -H "Authorization: Bearer <token>"

# Get by ID
curl http://localhost:8080/api/suppliers/1 \
  -H "Authorization: Bearer <token>"

# Create
curl -X POST http://localhost:8080/api/suppliers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"categoryId":1,"name":"TechSupply Co.","contactPerson":"John Doe","phone":"555-1234","email":"contact@techsupply.com","address":"123 Tech Street, CA"}'

# Update
curl -X PUT http://localhost:8080/api/suppliers/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"categoryId":2,"name":"TechSupply International","contactPerson":"Jane Smith","phone":"555-5678","email":"jane@techsupply.com","address":"456 Innovation Ave, CA"}'

# Delete
curl -X DELETE http://localhost:8080/api/suppliers/1 \
  -H "Authorization: Bearer <token>"
```

---

## 9. Analytics

### 9.1 Supplier Performance

**`GET /api/analytics/supplier-performance?month=3&year=2026`** — 🔑 ADMIN / ADMIN_STOCK

Returns all suppliers with their aggregated sales performance for the given month. Suppliers with zero sales in that month are included with zeroed values. Sorted by `totalRevenue` descending.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `month` | `int` | Yes | Month number (1–12) |
| `year` | `int` | Yes | Year (e.g. `2026`) |

**How values are calculated:**

| Field | Calculation |
|-------|-------------|
| `totalRevenue` | `SUM(orderItem.price × orderItem.quantity)` across all non-CANCELLED orders in the period |
| `totalOrders` | Count of distinct orders containing at least one product from this supplier |
| `totalItems` | `SUM(orderItem.quantity)` for this supplier's products |

**Success — `200 OK`:**

```json
[
  {
    "supplierId": 1,
    "supplierName": "BlueStar Imports",
    "totalRevenue": 45200.00,
    "totalOrders": 12,
    "totalItems": 34
  },
  {
    "supplierId": 2,
    "supplierName": "Apex Trading LLC",
    "totalRevenue": 28500.00,
    "totalOrders": 8,
    "totalItems": 19
  },
  {
    "supplierId": 3,
    "supplierName": "GreenLeaf Wholesale",
    "totalRevenue": 0,
    "totalOrders": 0,
    "totalItems": 0
  }
]
```

**Failure Responses:**

| Status | Scenario | Message |
|--------|----------|---------|
| `400` | Missing or invalid `month`/`year` params | `"Required parameter 'month' is not present"` |
| `401` | No token / invalid token | `"Unauthorized"` |
| `403` | Insufficient role | `"Forbidden"` |

---

## 10. Notes

- **Token expiry:** 4 days (`345600000 ms`). After expiry, call `POST /api/auth/login` again.
- **Logout is client-side:** The JWT stays cryptographically valid until its expiry time. The client must delete it from storage.
- **Sorting is by price** on all product list endpoints.
- **`DELETE /api/auth/users`** requires ADMIN role — unauthorized calls return `401`/`403`.
- **Startup seeders** run automatically when the application starts: default roles (`USER`, `SUPPLIER`, `ADMIN_STOCK`, `ADMIN_ORDER`, `ADMIN`) and seeded users (`raghul`, `ram`, `nirav`, `mani`, `sase`) are created if they don't already exist.
- **`GET /api/orders/admin/all`** supports date filtering: use `date=yyyy-MM-dd` for a single day, or `month` + `year` together for a full month. `date` takes priority if both are provided.
- **`GET /api/products`** (exact path only) is public. **`GET /api/products/{id}`** requires authentication.
- **`GET /api/products/category/{categoryId}`** is public.
- **`POST /api/seeder/run`** is public and inserts 6 suppliers, 5 categories, and 69 products (15 per category except Clothing with 9). It is **not idempotent** — each call inserts a new set of records.
- **`POST /api/seeder/orders`** is public and seeds 36 dummy orders with stock movements and inventory adjustments. It is **idempotent** — skips if orders already exist. Must be called after `/api/seeder/run` and the user seeders.
- All other endpoints require `Authorization: Bearer <token>`.
