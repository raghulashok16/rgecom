import axiosInstance from './axiosInstance';

// ── Auth ───────────────────────────────────────────────────────────────────────

// POST /auth/register — register a new user (PUBLIC)
//
// Request:
//   {
//     "username": "john_doe",
//     "email":    "john@example.com",
//     "password": "secret123"
//   }
//
// Response: 201 Created
//   {
//     "id":        1,
//     "username":  "john_doe",
//     "email":     "john@example.com",
//     "role":      "USER",
//     "createdAt": "2026-03-04T10:20:15"
//   }
//
export const registerRequest = (username, email, password) =>
  axiosInstance.post('/auth/register', { username, email, password });

// POST /auth/login — log in and receive a JWT token (PUBLIC)
//
// Request:
//   {
//     "username": "john_doe",
//     "password": "secret123"
//   }
//
// Response: 200 OK
//   {
//     "token":    "eyJhbGciOiJIUzI1NiJ9...",
//     "username": "john_doe",
//     "role":     "USER"
//   }
//
// JWT Claims decoded from token:
//   {
//     "sub":    "john_doe",
//     "role":   "USER",
//     "userId": 1,
//     "email":  "john@example.com",
//     "iat":    1709550015,
//     "exp":    1709636415
//   }
//
export const loginRequest = (username, password) =>
  axiosInstance.post('/auth/login', { username, password });

// POST /auth/logout — notify server of logout, client must delete the token (PUBLIC)
//
// Request:  (no body)
//
// Response: 200 OK
//   {
//     "message": "Logout successful"
//   }
//
export const logoutRequest = () =>
  axiosInstance.post('/auth/logout');

// DELETE /auth/users — delete all users from the database (PUBLIC)
//
// Request:  (no body)
//
// Response: 204 No Content (empty body)
//
export const deleteAllUsers = () =>
  axiosInstance.delete('/auth/users');

// ── Products (Public) ──────────────────────────────────────────────────────────

// GET /products?page=0&size=10&sort=asc — fetch all products with pagination (PUBLIC)
//
// Request:  (no body)  query params: page, size, sort
//
// Response: 200 OK
//   {
//     "content": [
//       {
//         "id":          1,
//         "name":        "Laptop",
//         "description": "High-performance laptop with 16GB RAM",
//         "price":       1299.99,
//         "categoryId":  1,
//         "supplierId":  1,
//         "createdAt":   "2026-03-04T10:20:15"
//       },
//       {
//         "id":          2,
//         "name":        "Mouse",
//         "description": "Wireless optical mouse",
//         "price":       29.99,
//         "categoryId":  null,
//         "supplierId":  null,
//         "createdAt":   "2026-03-04T10:25:00"
//       }
//     ],
//     "totalPages":       5,
//     "totalElements":    50,
//     "size":             10,
//     "numberOfElements": 2
//   }
//
export const fetchProducts = (page, size, sort) =>
  axiosInstance.get('/products', { params: { page, size, sort } });

// GET /products/category/:id?page=0&size=10&sort=asc — fetch products by category (PUBLIC)
//
// Request:  (no body)  query params: page, size, sort
//
// Response: 200 OK
//   {
//     "content": [
//       {
//         "id":          1,
//         "name":        "Laptop",
//         "description": "High-performance laptop with 16GB RAM",
//         "price":       1299.99,
//         "categoryId":  1,
//         "supplierId":  1,
//         "createdAt":   "2026-03-04T10:20:15"
//       }
//     ],
//     "totalPages":       1,
//     "totalElements":    1,
//     "size":             10,
//     "numberOfElements": 1
//   }
//
export const fetchProductsByCategory = (categoryId, page, size, sort) =>
  axiosInstance.get(`/products/category/${categoryId}`, { params: { page, size, sort } });

// ── Products (Protected) ───────────────────────────────────────────────────────

// GET /products/search?name=Laptop&page=0&size=10&sort=asc — search by name, partial & case-insensitive (PROTECTED)
//
// Request:  (no body)  query params: name, page, size, sort
//
// Response: 200 OK
//   {
//     "content": [
//       {
//         "id":          1,
//         "name":        "Laptop",
//         "description": "High-performance laptop with 16GB RAM",
//         "price":       1299.99,
//         "categoryId":  1,
//         "supplierId":  1,
//         "createdAt":   "2026-03-04T10:20:15"
//       },
//       {
//         "id":          3,
//         "name":        "Laptop Stand",
//         "description": "Adjustable aluminium laptop stand",
//         "price":       49.99,
//         "categoryId":  null,
//         "supplierId":  null,
//         "createdAt":   "2026-03-04T11:00:00"
//       }
//     ],
//     "totalPages":       1,
//     "totalElements":    2,
//     "size":             10,
//     "numberOfElements": 2
//   }
//
export const searchProducts = (name, page, size, sort) =>
  axiosInstance.get('/products/search', { params: { name, page, size, sort } });

// GET /products/:id — fetch a single product by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   {
//     "id":          1,
//     "name":        "Laptop",
//     "description": "High-performance laptop with 16GB RAM",
//     "price":       1299.99,
//     "categoryId":  1,
//     "supplierId":  1,
//     "createdAt":   "2026-03-04T10:20:15"
//   }
//
export const fetchProductById = (id) =>
  axiosInstance.get(`/products/${id}`);

// POST /products — create a new product (PROTECTED)
//
// Request:
  // {
  //   "name":        "Laptop",
  //   "description": "High-performance laptop with 16GB RAM",
  //   "price":       1299.99,
  //   "categoryId":  1,
  //   "supplierId":  1
  // }
//
// Response: 201 Created
//   {
//     "id":          1,
//     "name":        "Laptop",
//     "description": "High-performance laptop with 16GB RAM",
//     "price":       1299.99,
//     "categoryId":  1,
//     "supplierId":  1,
//     "createdAt":   "2026-03-04T10:20:15"
//   }
//
export const createProduct = (name, description, price, categoryId, supplierId, imageUrl, active) =>
  axiosInstance.post('/products', { name, description, price, categoryId, supplierId, imageUrl, ...(active !== undefined && { active }) });

// POST /products/supplier — create a product as a supplier (SUPPLIER role)
// supplierId is resolved from the JWT — do NOT send it in the body.
// Product is created with active: false (pending admin approval).
export const createSupplierProduct = (name, description, price, categoryId, imageUrl, supplierId) =>
  axiosInstance.post('/products/supplier', { name, description, price, categoryId, imageUrl, ...(supplierId != null && { supplierId: parseInt(supplierId) }) });

// PUT /products/:id — fully update an existing product (PROTECTED)
//
// Request:
//   {
//     "name":        "Laptop Pro",
//     "description": "Updated high-performance laptop with 32GB RAM",
//     "price":       1499.99,
//     "categoryId":  1,
//     "supplierId":  null
//   }
//
// Response: 200 OK
//   {
//     "id":          1,
//     "name":        "Laptop Pro",
//     "description": "Updated high-performance laptop with 32GB RAM",
//     "price":       1499.99,
//     "categoryId":  1,
//     "supplierId":  null,
//     "createdAt":   "2026-03-04T10:20:15"
//   }
//
export const updateProduct = (id, name, description, price, categoryId, supplierId, imageUrl, active) =>
  axiosInstance.put(`/products/${id}`, { name, description, price, categoryId, supplierId, imageUrl, ...(active !== undefined && { active }) });

// DELETE /products/:id — delete a product by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 204 No Content (empty body)
//
export const deleteProduct = (id) =>
  axiosInstance.delete(`/products/${id}`);

// ── Categories (Protected) ─────────────────────────────────────────────────────

// GET /categories — fetch all categories (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   [
//     {
//       "id":          1,
//       "name":        "Electronics",
//       "description": "Electronic devices and accessories",
//       "createdAt":   "2026-03-04T10:20:15"
//     },
//     {
//       "id":          2,
//       "name":        "Books",
//       "description": "Educational and leisure books",
//       "createdAt":   "2026-03-04T10:25:00"
//     }
//   ]
//
export const fetchCategories = () =>
  axiosInstance.get('/categories');

// GET /categories/:id — fetch a single category by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   {
//     "id":          1,
//     "name":        "Electronics",
//     "description": "Electronic devices and accessories",
//     "createdAt":   "2026-03-04T10:20:15"
//   }
//
export const fetchCategoryById = (id) =>
  axiosInstance.get(`/categories/${id}`);

// POST /categories — create a new category (PROTECTED)
//
// Request:
//   {
//     "name":        "Electronics",
//     "description": "Electronic devices and accessories"
//   }
//
// Response: 201 Created
//   {
//     "id":          1,
//     "name":        "Electronics",
//     "description": "Electronic devices and accessories",
//     "createdAt":   "2026-03-04T10:20:15"
//   }
//
export const createCategory = (name, description) =>
  axiosInstance.post('/categories', { name, description });

// PUT /categories/:id — update an existing category (PROTECTED)
//
// Request:
//   {
//     "name":        "Electronics & Gadgets",
//     "description": "Electronic devices, gadgets, and accessories"
//   }
//
// Response: 200 OK
//   {
//     "id":          1,
//     "name":        "Electronics & Gadgets",
//     "description": "Electronic devices, gadgets, and accessories",
//     "createdAt":   "2026-03-04T10:20:15"
//   }
//
export const updateCategory = (id, name, description) =>
  axiosInstance.put(`/categories/${id}`, { name, description });

// DELETE /categories/:id — delete a category by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 204 No Content (empty body)
//
export const deleteCategory = (id) =>
  axiosInstance.delete(`/categories/${id}`);

// ── Suppliers (Protected) ──────────────────────────────────────────────────────

// GET /suppliers — fetch all suppliers (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   [
//     {
//       "id":            1,
//       "categoryId":    1,
//       "name":          "TechSupply Co.",
//       "contactPerson": "John Doe",
//       "phone":         "555-1234",
//       "email":         "contact@techsupply.com",
//       "address":       "123 Tech Street, Silicon Valley, CA",
//       "createdAt":     "2026-03-04T10:20:15"
//     }
//   ]
//
export const fetchSuppliers = () =>
  axiosInstance.get('/suppliers');

// GET /suppliers/:id — fetch a single supplier by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   {
//     "id":            1,
//     "categoryId":    1,
//     "name":          "TechSupply Co.",
//     "contactPerson": "John Doe",
//     "phone":         "555-1234",
//     "email":         "contact@techsupply.com",
//     "address":       "123 Tech Street, Silicon Valley, CA",
//     "createdAt":     "2026-03-04T10:20:15"
//   }
//
export const fetchSupplierById = (id) =>
  axiosInstance.get(`/suppliers/${id}`);

// POST /suppliers — create a new supplier (PROTECTED)
//
// Request:
//   {
//     "categoryId":    1,
//     "name":          "TechSupply Co.",
//     "contactPerson": "John Doe",
//     "phone":         "555-1234",
//     "email":         "contact@techsupply.com",
//     "address":       "123 Tech Street, Silicon Valley, CA"
//   }
//
// Response: 201 Created
//   {
//     "id":            1,
//     "categoryId":    1,
//     "name":          "TechSupply Co.",
//     "contactPerson": "John Doe",
//     "phone":         "555-1234",
//     "email":         "contact@techsupply.com",
//     "address":       "123 Tech Street, Silicon Valley, CA",
//     "createdAt":     "2026-03-04T10:20:15"
//   }
//
export const createSupplier = (name, contactPerson, phone, email, address, categoryId) =>
  axiosInstance.post('/suppliers', { name, contactPerson, phone, email, address, categoryId: categoryId || null });

// PUT /suppliers/:id — update an existing supplier (PROTECTED)
//
// Request:
//   {
//     "categoryId":    2,
//     "name":          "TechSupply International",
//     "contactPerson": "Jane Smith",
//     "phone":         "555-5678",
//     "email":         "jane@techsupply.com",
//     "address":       "456 Innovation Ave, San Francisco, CA"
//   }
//
// Response: 200 OK
//   {
//     "id":            1,
//     "categoryId":    2,
//     "name":          "TechSupply International",
//     "contactPerson": "Jane Smith",
//     "phone":         "555-5678",
//     "email":         "jane@techsupply.com",
//     "address":       "456 Innovation Ave, San Francisco, CA",
//     "createdAt":     "2026-03-04T10:20:15"
//   }
//
export const updateSupplier = (id, name, contactPerson, phone, email, address, categoryId) =>
  axiosInstance.put(`/suppliers/${id}`, { name, contactPerson, phone, email, address, categoryId: categoryId || null });

// DELETE /suppliers/:id — delete a supplier by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 204 No Content (empty body)
//
export const deleteSupplier = (id) =>
  axiosInstance.delete(`/suppliers/${id}`);

// ── Orders (Protected) ─────────────────────────────────────────────────────────

// POST /orders — create a new order (PROTECTED)
//
// Request:  (userId resolved from JWT — do NOT send userId in body)
//   {
//     "customerName":   "John Doe",
//     "customerEmail":  "john@example.com",
//     "items": [
//       { "productId": 10, "quantity": 2 },
//       { "productId": 15, "quantity": 1 }
//     ]
//   }
//
// Response: 201 Created
//   {
//     "id":            12,
//     "orderNumber":   "ORD-20260301-0012",
//     "customerName":  "John Doe",
//     "customerEmail": "john@example.com",
//     "totalAmount":   249.99,
//     "status":        "ORDERED",
//     "createdAt":     "2026-03-01T10:00:00",
//     "items": [
//       {
//         "id":          1,
//         "productId":   10,
//         "productName": "Wireless Noise-Cancelling Headphones",
//         "quantity":    2,
//         "price":       124.99
//       }
//     ],
//     "timeline": {
//       "orderedAt":      "01/03/2026",
//       "paymentAt":      null,
//       "confirmationAt": null,
//       "deliveryAt":     null
//     }
//   }
//
export const createOrder = (customerName, customerEmail, items) =>
  axiosInstance.post('/orders', { customerName, customerEmail, items });

// GET /orders — get orders for the authenticated user (PROTECTED)
//
// Request:  (no body)  user resolved from JWT — no query params needed
//
// Response: 200 OK
//   [
//     {
//       "id":              12,
//       "orderNumber":     "ORD-20260301-0012",
//       "firstItemName":   "Wireless Noise-Cancelling H...",
//       "extraItemsCount": 0,
//       "totalAmount":     249.99,
//       "status":          "ORDERED",
//       "timeline": {
//         "orderedAt":      "01/03/2026",
//         "paymentAt":      "01/03/2026",
//         "confirmationAt": null,
//         "deliveryAt":     null
//       }
//     }
//   ]
//
export const fetchOrdersByUser = () =>
  axiosInstance.get('/orders');

// GET /orders/:id — get a single order by ID (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   {
//     "id":            12,
//     "orderNumber":   "ORD-20260301-0012",
//     "customerName":  "John Doe",
//     "customerEmail": "john@example.com",
//     "totalAmount":   249.99,
//     "status":        "ORDERED",
//     "createdAt":     "2026-03-01T10:00:00",
//     "items": [
//       {
//         "id":          1,
//         "productId":   10,
//         "productName": "Wireless Noise-Cancelling Headphones",
//         "quantity":    2,
//         "price":       124.99
//       }
//     ],
//     "timeline": {
//       "orderedAt":      "01/03/2026",
//       "paymentAt":      "01/03/2026",
//       "confirmationAt": null,
//       "deliveryAt":     null
//     }
//   }
//
export const fetchOrderById = (id) =>
  axiosInstance.get(`/orders/${id}`);

// PATCH /orders/:id/status — update order status (PROTECTED)
//
// Request:
//   { "status": "DELIVERED" }
//   Valid values: ORDERED | PAYMENT | CONFIRMED | DELIVERED | CANCELLED
//
// Timeline behaviour:
//   ORDERED   → no new timestamps set
//   PAYMENT   → paymentAt set to now
//   CONFIRMED → confirmationAt set to now
//   DELIVERED → deliveryAt set to now
//   CANCELLED → all timestamps cleared; cancelledAt set to now
//
// Response: 200 OK  (full order object with updated timeline)
//
export const updateOrderStatus = (id, status) =>
  axiosInstance.patch(`/orders/${id}/status`, { status });

// DELETE /orders/:id/cancel — cancel an order (PROTECTED)
//
// Request:  (no body)
//
// Response: 200 OK
//   {
//     "id":            11,
//     "orderNumber":   "ORD-20260306-0011",
//     "status":        "CANCELLED",
//     "timeline": {
//       "orderedAt":      null,
//       "paymentAt":      null,
//       "confirmationAt": null,
//       "deliveryAt":     null,
//       "cancelledAt":    "06/03/2026"
//     }
//   }
//
export const cancelOrder = (id) =>
  axiosInstance.delete(`/orders/${id}/cancel`);

// GET /orders/admin/all — get all orders paginated, optional status filter (PROTECTED)
//
// Request:  (no body)  query params: status, page, size
//
// Response: 200 OK
//   {
//     "content": [
//       {
//         "id":              12,
//         "orderNumber":     "ORD-20260301-0012",
//         "firstItemName":   "Wireless Noise-Cancelling H...",
//         "extraItemsCount": 0,
//         "totalAmount":     249.99,
//         "status":          "ORDERED",
//         "timeline": {
//           "orderedAt":      "01/03/2026",
//           "paymentAt":      null,
//           "confirmationAt": null,
//           "deliveryAt":     null
//         }
//       }
//     ],
//     "totalElements": 50,
//     "totalPages":    5,
//     "size":          10,
//     "number":        0
//   }
//
export const fetchAllOrdersAdmin = (status, page, size, date, month, year) =>
  axiosInstance.get('/orders/admin/all', { params: { status, page, size, date, month, year } });


// ── Users (Admin) ─────────────────────────────────────────────────────────────

// GET /auth/users — fetch all registered users (ADMIN)
//
// Response: 200 OK
//   [
//     {
//       "id":        1,
//       "username":  "john_doe",
//       "email":     "john@example.com",
//       "role":      "USER",
//       "active":    true,
//       "createdAt": "2026-03-04T10:20:15"
//     }
//   ]
//
export const fetchAllUsers = () =>
  axiosInstance.get('/auth/users');

// GET /auth/users/search?name={name} — case-insensitive partial match, excludes 'raghul' (ADMIN / ADMIN_STOCK)
export const searchUsers = (name) =>
  axiosInstance.get('/auth/users/search', { params: { name } });

// GET /auth/users/filter?role={admin|supplier|user}&active={true|false} — filter by role group, optionally by active (ADMIN / ADMIN_STOCK)
export const filterUsers = (role, active) => {
  const params = { role };
  if (active !== '' && active !== undefined) params.active = active;
  return axiosInstance.get('/auth/users/filter', { params });
};

// PATCH /auth/users/:id — update active status and roles (ADMIN)
//
// Request:
//   { "active": false, "roles": ["USER", "ADMIN_STOCK"] }
//
// Response: 200 OK  (updated user object)
//
export const updateUserActive = (id, active, roles) =>
  axiosInstance.patch(`/auth/users/${id}`, { active, roles });

// GET /products/supplier?page=0&size=10&sort=asc — fetch logged-in supplier's own products (SUPPLIER)
export const fetchSupplierProducts = (page, size, sort) =>
  axiosInstance.get('/products/supplier', { params: { page, size, sort } });

// POST /api/seeder/run — Seeds 6 suppliers, 5 categories, 50 products (NOT idempotent)
export const runSeeder = () =>
  axiosInstance.post('/seeder/run');

// POST /api/seeder/roles — Seeds default roles: USER, SUPPLIER, ADMIN_STOCK, ADMIN_ORDER (idempotent)
export const seedRoles = () =>
  axiosInstance.post('/seeder/roles');

// ── Inventory ──────────────────────────────────────────────────────────────────

// GET /api/inventory — returns all inventory items (ADMIN / ADMIN_STOCK)
export const fetchInventory = () =>
  axiosInstance.get('/inventory');

// GET /api/inventory/movements — all stock movements across all products, newest first (ADMIN)
export const fetchAllStockMovements = () =>
  axiosInstance.get('/inventory/movements');

// GET /api/inventory/{productId}/movements — stock movements for a product (newest first)
// referenceType: "ORDER" | "ORDER_CANCEL" | "RESTOCK" | "ADJUSTMENT"
export const fetchStockMovements = (productId) =>
  axiosInstance.get(`/inventory/${productId}/movements`);

// GET /api/analytics/supplier-performance?month=3&year=2026 — ADMIN / ADMIN_STOCK
export const getSupplierPerformance = (month, year) =>
  axiosInstance.get(`/analytics/supplier-performance?month=${month}&year=${year}`);

// POST /api/inventory/{productId}/adjust — Adjust stock (ADMIN / ADMIN_STOCK / SUPPLIER)
// movementType: "IN" | "OUT" | "ADJUSTMENT"
// quantity: >= 1
export const adjustStock = (productId, movementType, quantity) =>
  axiosInstance.post(`/inventory/${productId}/adjust`, { movementType, quantity });
