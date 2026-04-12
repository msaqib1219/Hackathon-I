"""Pydantic models for API requests/responses.

Auth is now handled by better-auth server. This file retains
only models used by the FastAPI backend endpoints.
"""

from typing import Optional
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    detail: str
