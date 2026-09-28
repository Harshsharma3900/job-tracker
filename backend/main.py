from fastapi import FastAPI, Header, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from database import get_db
from auth import (
    create_token,
    get_current_user,
    hash_password,
    verify_password
)

app = FastAPI()
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    print(f"Server Error: {exc}")

    return JSONResponse(
        status_code=500,
        content={
            "message": "Something went wrong on the server"
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://job-tracker-bay-eight.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()


@app.get("/")
def home():
    return {
        "message": "Job Tracker API is running"
    }


@app.post("/register")
def register(name: str, email: str, password: str):

    connection = get_db()

    existing_user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing_user:
        connection.close()
        return {
            "message": "Email already registered"
        }

    hashed_password = hash_password(password)

    connection.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (name, email, hashed_password)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Registration successful",
        "name": name,
        "email": email
    }


@app.post("/login")
def login(email: str, password: str):

    connection = get_db()

    user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    connection.close()

    if not user:
        return {
            "message": "Invalid email or password"
        }

    if not verify_password(password, user["password"]):
        return {
            "message": "Invalid email or password"
        }

    token = create_token(user["id"])

    return {
        "message": "Login successful",
        "access_token": token
    }

@app.get("/me")
def get_me(authorization: str = Header(None)):

    user_id = get_current_user(authorization)

    if not user_id:
        return {
            "message": "Please login first"
        }

    connection = get_db()

    user = connection.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    connection.close()

    if not user:
        return {
            "message": "User not found"
        }

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"]
    }


@app.post("/jobs")
def add_job(
    company: str,
    role: str,
    location: str,
    status: str = "Applied",
    job_link: str = "",
    salary: str = "",
    applied_date: str = "",
    authorization: str = Header(None)
):

    user_id = get_current_user(authorization)

    if not user_id:
        return {
            "message": "Please login first"
        }

    connection = get_db()

    connection.execute(
        """
        INSERT INTO jobs
        (company, role, location, status, job_link, salary, applied_date, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            company,
            role,
            location,
            status,
            job_link,
            salary,
            applied_date,
            user_id
        )
    )

    connection.commit()
    connection.close()

    return {
        "message": "Job added successfully",
        "user_id": user_id
    }


@app.get("/jobs")
def get_jobs(authorization: str = Header(None)):

    user_id = get_current_user(authorization)

    if not user_id:
        return {
            "message": "Please login first"
        }

    connection = get_db()

    jobs = connection.execute(
        "SELECT * FROM jobs WHERE user_id = ?",
        (user_id,)
    ).fetchall()

    connection.close()

    return {
        "user_id": user_id,
        "jobs": [dict(job) for job in jobs]
    }


@app.put("/jobs/{job_id}")
def update_job(
    job_id: int,
    status: str,
    salary: str = "",
    authorization: str = Header(None)
):

    user_id = get_current_user(authorization)

    if not user_id:
        return {
            "message": "Please login first"
        }

    connection = get_db()

    job = connection.execute(
        "SELECT * FROM jobs WHERE id = ? AND user_id = ?",
        (job_id, user_id)
    ).fetchone()

    if not job:
        connection.close()
        return {
            "message": "Job not found"
        }

    connection.execute(
        """
        UPDATE jobs
        SET status = ?, salary = ?
        WHERE id = ? AND user_id = ?
        """,
        (status, salary, job_id, user_id)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Job updated successfully",
        "user_id": user_id
    }


@app.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    authorization: str = Header(None)
):

    user_id = get_current_user(authorization)

    if not user_id:
        return {
            "message": "Please login first"
        }

    connection = get_db()

    job = connection.execute(
        "SELECT * FROM jobs WHERE id = ? AND user_id = ?",
        (job_id, user_id)
    ).fetchone()

    if not job:
        connection.close()
        return {
            "message": "Job not found"
        }

    connection.execute(
        """
        DELETE FROM jobs
        WHERE id = ? AND user_id = ?
        """,
        (job_id, user_id)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Job deleted successfully",
        "user_id": user_id
    }