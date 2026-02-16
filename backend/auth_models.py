"""Pydantic models for authentication requests and responses."""

import re
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", v):
            raise ValueError("Invalid email format")
        if len(v) > 255:
            raise ValueError("Email must be 255 characters or fewer")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if len(v) > 128:
            raise ValueError("Password must be 128 characters or fewer")
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError("Password must contain at least one letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Name is required")
        if len(v) > 255:
            raise ValueError("Name must be 255 characters or fewer")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return v.strip().lower()


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfile"


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    auth_methods: List[str] = []
    created_at: Optional[datetime] = None


class ErrorResponse(BaseModel):
    detail: str
