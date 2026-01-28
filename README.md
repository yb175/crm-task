---

# 🧩 Mini CRM Backend API

A role-based CRM backend built with **Express + TypeScript + Prisma + PostgreSQL**.
This system supports authentication, user management, customer tracking, and task assignment with strict role-based access control.

---

## 🚀 Tech Stack

* **Node.js + Express**
* **TypeScript**
* **Prisma ORM**
* **PostgreSQL**
* **JWT Authentication**
* **Zod Validation**
* **Swagger (OpenAPI) Documentation**

---

## 📁 Project Structure

```
crm-task/
├── controllers/        # Business logic
├── middleware/         # Auth & role guards
├── routes/             # API route definitions
├── prisma/             # Database schema
├── lib/                # Prisma client setup
├── utils/              # Validation schemas
├── src/                # App entry + swagger config
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public
JWT_SECRET=your_super_secret_key
```

---

## 🛠 Installation & Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Generate Prisma client

```bash
npx prisma generate
```

### 3️⃣ Run database migration

```bash
npx prisma migrate dev --name init
```

### 4️⃣ Start the server

```bash
npx tsx src/app.ts
```

Server runs at:

```
http://localhost:5000
```

Swagger Docs:

```
http://localhost:5000/api-docs
```

---

## 🔐 Authentication

JWT-based authentication using Bearer tokens.

### Register

`POST /auth/register`

### Login

`POST /auth/login`

Login response includes:

```json
{
  "accessToken": "JWT_TOKEN",
  "user": { "id", "name", "email", "role" }
}
```

Use token in requests:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 👥 Roles

| Role         | Permissions                                                      |
| ------------ | ---------------------------------------------------------------- |
| **ADMIN**    | Full access to users, customers, and tasks                       |
| **EMPLOYEE** | Can view customers, see assigned tasks, update their task status |

---

## 📦 API Modules

### 🔑 Auth Module

* Register new users
* Login & receive JWT

### 👤 Users Module (Admin Only)

* View all users
* View user by ID
* Update user role

### 🧑‍💼 Customers Module

* Create customer (Admin)
* Get paginated customers (All authenticated users)
* Get customer by ID
* Update customer (Admin)
* Delete customer (Admin)

### 📝 Tasks Module

* Create task (Admin)
* Get tasks (Admin → all, Employee → only assigned)
* Update task status (Employee → only their task)

---

## 🧠 Business Rules

* Passwords are hashed with **bcrypt**
* JWT contains `userId` and `role`
* Employees cannot modify other employees’ tasks
* Tasks must be linked to:

  * A valid **customer**
  * A valid **employee**

---

## 📚 Swagger API Documentation

Interactive documentation available at:

```
http://localhost:5000/api-docs
```

Includes:

* Request/response schemas
* Authentication
* All endpoints grouped by module

---

## 🗄 Database Schema (Overview)

### User

* id, name, email, password, role

### Customer

* id, name, email, phone, company

### Task

* id, title, description, status
* assignedTo → User
* customerId → Customer

---

## 🧪 Sample Test Flow

1. Register an **ADMIN**
2. Login → Copy JWT
3. Authorize in Swagger
4. Create Customers
5. Register EMPLOYEE
6. Create Tasks assigned to EMPLOYEE
7. Login as EMPLOYEE → View only own tasks

---

## ✅ Features Implemented

✔ JWT Authentication
✔ Role-based Authorization
✔ CRUD Operations
✔ Pagination
✔ Input Validation
✔ Relational Data Handling
✔ Swagger Documentation

---

## 👨‍💻 Author

Built as part of a backend engineering assignment demonstrating API design, security, and relational data modeling.

---

