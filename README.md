# RG Ecom — E-Commerce Management System

A full-stack e-commerce management platform with a React frontend and Spring Boot backend.

**Live App:** [https://staging.d4wwnhcgxeinv.amplifyapp.com/](https://staging.d4wwnhcgxeinv.amplifyapp.com/)

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, Redux, Tailwind CSS, Framer Motion |
| Backend   | Spring Boot 3, Java, JWT Auth, Swagger          |
| Database  | MySQL                                           |
| Hosting   | AWS Amplify (Frontend)                          |

---

## Features

- JWT-based authentication & role-based access control
- Product, category, and supplier management
- Order management with status tracking
- Inventory management with low stock alerts and stock movement history
- Analytics dashboard with sales charts and supplier performance
- PDF report generation (sales, stock level, low stock, supplier details)
- Admin panel for user management

---

## Getting Started

### Backend

**Prerequisites:** Java 17+, Maven, MySQL

1. Create a MySQL database named `ecom`
2. Update credentials in `backend/src/main/resources/application.properties`
3. Run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### Frontend

**Prerequisites:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> Never commit secrets or `.env` files — they are excluded via `.gitignore`.
