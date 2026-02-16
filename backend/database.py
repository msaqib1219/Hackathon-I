import os
import hashlib
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
import asyncpg

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


async def init_db():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        # Existing table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                session_id TEXT NOT NULL,
                user_message TEXT NOT NULL,
                bot_response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Auth tables
        await conn.execute('''
            CREATE EXTENSION IF NOT EXISTS "pgcrypto"
        ''')

        await conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        ''')

        await conn.execute('''
            CREATE TABLE IF NOT EXISTS oauth_accounts (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                provider VARCHAR(50) NOT NULL,
                provider_user_id VARCHAR(255) NOT NULL,
                provider_email VARCHAR(255),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(provider, provider_user_id)
            )
        ''')

        await conn.execute('''
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id SERIAL PRIMARY KEY,
                token_hash VARCHAR(64) UNIQUE NOT NULL,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires_at TIMESTAMPTZ NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        ''')

        # Add user_id column to chat_history if it doesn't exist
        await conn.execute('''
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'chat_history' AND column_name = 'user_id'
                ) THEN
                    ALTER TABLE chat_history ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
                END IF;
            END $$
        ''')

        # Create indexes (IF NOT EXISTS is implicit for CREATE INDEX with this pattern)
        await conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        ''')
        await conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_accounts(user_id)
        ''')
        await conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_refresh_user_id ON refresh_tokens(user_id)
        ''')
        await conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_refresh_expires_at ON refresh_tokens(expires_at)
        ''')
    finally:
        await conn.close()


# --- Chat history functions (existing) ---

async def add_message(session_id: str, user_message: str, bot_response: str, user_id: Optional[str] = None):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        if user_id:
            await conn.execute('''
                INSERT INTO chat_history (session_id, user_message, bot_response, user_id)
                VALUES ($1, $2, $3, $4::uuid)
            ''', session_id, user_message, bot_response, user_id)
        else:
            await conn.execute('''
                INSERT INTO chat_history (session_id, user_message, bot_response)
                VALUES ($1, $2, $3)
            ''', session_id, user_message, bot_response)
    finally:
        await conn.close()


async def get_history(session_id: str):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        rows = await conn.fetch('''
            SELECT user_message, bot_response FROM chat_history
            WHERE session_id = $1
            ORDER BY created_at ASC
        ''', session_id)
    finally:
        await conn.close()
    result = []
    for row in rows:
        result.append({"role": "user", "content": row["user_message"]})
        result.append({"role": "assistant", "content": row["bot_response"]})
    return result


# --- User CRUD functions (T006) ---

async def create_user(email: str, name: str, password_hash: Optional[str] = None) -> dict:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        row = await conn.fetchrow('''
            INSERT INTO users (email, name, password_hash)
            VALUES (LOWER($1), $2, $3)
            RETURNING id, email, name, password_hash, is_active, created_at, updated_at
        ''', email, name, password_hash)
    finally:
        await conn.close()
    return dict(row)


async def get_user_by_email(email: str) -> Optional[dict]:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        row = await conn.fetchrow('''
            SELECT id, email, name, password_hash, is_active, created_at, updated_at
            FROM users WHERE email = LOWER($1)
        ''', email)
    finally:
        await conn.close()
    return dict(row) if row else None


async def get_user_by_id(user_id: str) -> Optional[dict]:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        row = await conn.fetchrow('''
            SELECT id, email, name, password_hash, is_active, created_at, updated_at
            FROM users WHERE id = $1::uuid
        ''', user_id)
    finally:
        await conn.close()
    return dict(row) if row else None


# --- Refresh token functions (T007) ---

async def store_refresh_token(token_hash: str, user_id: str, expires_at: datetime):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        await conn.execute('''
            INSERT INTO refresh_tokens (token_hash, user_id, expires_at)
            VALUES ($1, $2::uuid, $3)
        ''', token_hash, user_id, expires_at)
    finally:
        await conn.close()


async def get_refresh_token(token_hash: str) -> Optional[dict]:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        row = await conn.fetchrow('''
            SELECT rt.id, rt.token_hash, rt.user_id, rt.expires_at, rt.created_at,
                   u.email, u.name, u.is_active
            FROM refresh_tokens rt
            JOIN users u ON u.id = rt.user_id
            WHERE rt.token_hash = $1
        ''', token_hash)
    finally:
        await conn.close()
    return dict(row) if row else None


async def delete_refresh_token(token_hash: str):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        await conn.execute('''
            DELETE FROM refresh_tokens WHERE token_hash = $1
        ''', token_hash)
    finally:
        await conn.close()


async def delete_user_refresh_tokens(user_id: str):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        await conn.execute('''
            DELETE FROM refresh_tokens WHERE user_id = $1::uuid
        ''', user_id)
    finally:
        await conn.close()


async def cleanup_expired_tokens():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        await conn.execute('''
            DELETE FROM refresh_tokens WHERE expires_at < NOW()
        ''')
    finally:
        await conn.close()


# --- OAuth account functions (used by US2, defined here for schema consistency) ---

async def create_oauth_account(user_id: str, provider: str, provider_user_id: str, provider_email: Optional[str] = None):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        await conn.execute('''
            INSERT INTO oauth_accounts (user_id, provider, provider_user_id, provider_email)
            VALUES ($1::uuid, $2, $3, $4)
            ON CONFLICT (provider, provider_user_id) DO NOTHING
        ''', user_id, provider, provider_user_id, provider_email)
    finally:
        await conn.close()


async def get_oauth_account(provider: str, provider_user_id: str) -> Optional[dict]:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        row = await conn.fetchrow('''
            SELECT oa.id, oa.user_id, oa.provider, oa.provider_user_id, oa.provider_email,
                   u.email, u.name, u.is_active
            FROM oauth_accounts oa
            JOIN users u ON u.id = oa.user_id
            WHERE oa.provider = $1 AND oa.provider_user_id = $2
        ''', provider, provider_user_id)
    finally:
        await conn.close()
    return dict(row) if row else None


async def get_user_oauth_methods(user_id: str) -> list:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        rows = await conn.fetch('''
            SELECT provider FROM oauth_accounts WHERE user_id = $1::uuid
        ''', user_id)
    finally:
        await conn.close()
    return [row["provider"] for row in rows]
