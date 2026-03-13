# LMS Platform - Production Ready

A sleek, robust, and premium Learning Management System built with React, Node.js, and PostgreSQL.

## Features
- 🔐 **JWT Authentication**: Secure login and signup with bcrypt password hashing.
- 📚 **Course Catalog**: Browse courses with category filtering and search.
- 🎓 **Enrollment System**: Enroll in courses to start learning.
- 📺 **Interactive Learning**: Watch lessons via embedded YouTube player.
- 📊 **Progress Tracking**: Real-time progress calculation and resume from last watched lesson.
- 💎 **Premium UI**: Modern glassmorphism design with TailwindCSS.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Axios, Lucide React, React Router
- **Backend**: Node.js, Express.js, PostgreSQL (pg), JWT, bcryptjs
- **Database**: PostgreSQL

## Project Structure
```text
lms-platform/
├── backend/            # Express Server
│   ├── config/         # DB Connection
│   ├── controllers/    # API Logic
│   ├── middleware/     # Auth Guards
│   ├── models/         # DB Models (SQL)
│   ├── routes/         # API Routes
│   └── server.js       # Entry Point
└── frontend/           # React App
    ├── src/
    │   ├── components/ # Reusable UI
    │   ├── pages/      # Route Components
    │   └── services/   # API Layer
    └── tailwind.config.js
```

## Setup Instructions

### 1. Database Setup
Create a PostgreSQL database named `lms_db` and run the schema from the `LMS` folder:
```bash
psql -U postgres -d lms_db -f lms-platform/backend/schema.sql
```

### 2. Backend Setup
From the `LMS` folder:
```bash
cd lms-platform/backend
npm install
# Update .env with your PostgreSQL credentials
npm start
```

### 3. Frontend Setup
Open a **second terminal** and from the `LMS` folder:
```bash
cd lms-platform/frontend
npm install
npm run dev
```

## API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/enroll`
- `POST /api/progress/update`
- `GET /api/progress/:course_id/:user_id`
