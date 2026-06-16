# Task Manager Fullstack

Aplikasi Task Manager Fullstack menggunakan React, Express.js, Supabase PostgreSQL, dan JWT Authentication.

## Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Task Management (CRUD)
- Task Completion Status
- Swagger API Documentation

## Tech Stack

### Frontend

- React
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- JWT
- bcrypt

### Database

- Supabase PostgreSQL

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000

SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_key

JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Swagger Documentation:

```text
http://localhost:5000/docs
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## API Documentation

API documentation is available through Swagger UI:

```text
http://localhost:5000/docs
```

---

## Project Structure

```text
project/
│
├── backend/
│
└── frontend/
```

---

## Preview

Add screenshots of:
![Login](./img/login.png)
![Register](./img/register.png)
![Dashboard](./img/dashboard.png)

---

## Author

Krisna Guntur Pamungkas
241080200051
