# Job Tracker

A full-stack Job Application Tracker built with React.js, Tailwind CSS, FastAPI, JWT Authentication, and SQLite.

## Features

- User Registration
- User Login
- JWT Authentication
- Password Hashing
- Protected Routes
- Add Job Applications
- View Job Applications
- Search Jobs
- Filter Jobs by Status
- Edit Job Status and Salary
- Delete Jobs
- Dashboard Statistics
- User Profile
- Responsive Desktop and Mobile UI
- Logout

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Vite

### Backend

- Python
- FastAPI
- JWT
- pwdlib / Argon2

### Database

- SQLite

## Project Structure

```text
job-tracker/
│
├── backend/
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md




| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/`              | Check API status      |
| POST   | `/register`      | Register a new user   |
| POST   | `/login`         | Login and receive JWT |
| GET    | `/me`            | Get current user      |
| POST   | `/jobs`          | Add a job             |
| GET    | `/jobs`          | Get user's jobs       |
| PUT    | `/jobs/{job_id}` | Update a job          |
| DELETE | `/jobs/{job_id}` | Delete a job          |




BACKEND
cd backend
fastapi dev main.py



http://127.0.0.1:8000
http://127.0.0.1:8000/docs


Frontend
cd frontend
npm install
npm run dev


Frontend:

http://localhost:5174


Environment Variables

Create a .env file inside the backend folder:

SECRET_KEY=your-secret-key

The .env file is excluded from Git using .gitignore.

Security
Passwords are hashed before storage.
JWT is used for authentication.
Protected job APIs require authentication.
User jobs are restricted to the logged-in user.
Secret keys are stored in environment variables.
Future Improvements
PostgreSQL database
Job reminders
Email notifications
Resume management
Analytics and charts
Production deployment
Cloud database integration
Author

Harsh Sharma

Built with React.js, FastAPI and SQLite.
