import os

from dotenv import load_dotenv
from jose import jwt, JWTError
from pwdlib import PasswordHash
from fastapi import Header


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not configured")

ALGORITHM = "HS256"

password_hash = PasswordHash.recommended()


def hash_password(password):
    return password_hash.hash(password)


def verify_password(password, hashed_password):
    return password_hash.verify(password, hashed_password)


def create_token(user_id):
    token = jwt.encode(
        {"user_id": user_id},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token


def get_current_user(authorization: str = Header(None)):
    if not authorization:
        return None

    try:
        token = authorization.replace("Bearer ", "")

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload.get("user_id")

    except JWTError:
        return None