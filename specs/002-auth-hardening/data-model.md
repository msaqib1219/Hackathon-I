# Data Model: Auth Hardening

**Date**: 2026-02-14
**Feature**: 002-auth-hardening
**Database**: Neon PostgreSQL (existing — same instance as `chat_history` table)

---

## Entity Relationship

```
users 1──* oauth_accounts
users 1──* refresh_tokens
users 1──* chat_history (existing, will add user_id FK)
```

---

## Table: `users`

Primary user identity table. One row per unique user regardless of auth method.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email (normalized to lowercase) |
| name | VARCHAR(255) | NOT NULL | Display name |
| password_hash | VARCHAR(255) | NULLABLE | bcrypt hash; NULL for OAuth-only users |
| is_active | BOOLEAN | DEFAULT TRUE | Soft-disable account |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last profile update |

**Indexes**:
- `idx_users_email` — UNIQUE index on `email` (for login lookup)

**Validation rules**:
- `email`: Must be valid email format, stored lowercase, max 255 chars
- `name`: 1-255 characters, trimmed whitespace
- `password_hash`: NULL only if user has at least one `oauth_accounts` entry

---

## Table: `oauth_accounts`

Links external OAuth provider identities to local users. Supports multiple providers per user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Auto-increment ID |
| user_id | UUID | FK → users(id) ON DELETE CASCADE, NOT NULL | Owning user |
| provider | VARCHAR(50) | NOT NULL | OAuth provider name (e.g., "google") |
| provider_user_id | VARCHAR(255) | NOT NULL | User ID from the OAuth provider |
| provider_email | VARCHAR(255) | NULLABLE | Email from OAuth provider (may differ from users.email) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Link creation time |

**Indexes**:
- `idx_oauth_provider_user` — UNIQUE index on `(provider, provider_user_id)` (prevent duplicate links)
- `idx_oauth_user_id` — Index on `user_id` (for lookup by user)

**Validation rules**:
- `provider`: Enum-like constraint — currently only "google" is valid
- `provider_user_id`: Non-empty string, provider-specific format

---

## Table: `refresh_tokens`

Tracks active refresh tokens for session management and logout invalidation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Auto-increment ID |
| token_hash | VARCHAR(64) | UNIQUE, NOT NULL | SHA-256 hash of the refresh token |
| user_id | UUID | FK → users(id) ON DELETE CASCADE, NOT NULL | Token owner |
| expires_at | TIMESTAMPTZ | NOT NULL | Token expiration time |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Token issuance time |

**Indexes**:
- `idx_refresh_token_hash` — UNIQUE index on `token_hash` (for token lookup on refresh)
- `idx_refresh_user_id` — Index on `user_id` (for revoking all user tokens on logout)
- `idx_refresh_expires_at` — Index on `expires_at` (for cleanup of expired tokens)

**Validation rules**:
- `token_hash`: 64-char hex string (SHA-256 output)
- `expires_at`: Must be in the future at creation time

---

## Existing Table: `chat_history` (modification)

Add optional `user_id` foreign key to link chat history to authenticated users.

| Column (new) | Type | Constraints | Description |
|--------------|------|-------------|-------------|
| user_id | UUID | FK → users(id) ON DELETE SET NULL, NULLABLE | Authenticated user who sent this message |

**Migration note**: Existing rows will have `user_id = NULL`. New messages from authenticated users will populate this field. The `session_id` column remains for backward compatibility.

---

## State Transitions

### User Account States

```
[New Registration] → Active (is_active = true)
Active → Disabled (is_active = false) [admin action, future scope]
Disabled → Active (is_active = true) [admin action, future scope]
```

### Refresh Token Lifecycle

```
[Login/Refresh] → Created (stored in DB)
Created → Used (deleted, new token issued — rotation)
Created → Expired (past expires_at — cleanup job deletes)
Created → Revoked (deleted on logout)
```

---

## SQL Migration Script

```sql
-- Migration: 001_create_auth_tables.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- OAuth accounts table
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_accounts(user_id);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_expires_at ON refresh_tokens(expires_at);

-- Add user_id to existing chat_history table
ALTER TABLE chat_history
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
```
