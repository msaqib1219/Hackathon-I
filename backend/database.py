import os
from dotenv import load_dotenv
import asyncpg

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def init_db():
    conn = await asyncpg.connect(DATABASE_URL)
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id SERIAL PRIMARY KEY,
            session_id TEXT NOT NULL,
            user_message TEXT NOT NULL,
            bot_response TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    await conn.close()

async def add_message(session_id: str, user_message: str, bot_response: str):
    conn = await asyncpg.connect(DATABASE_URL)
    await conn.execute('''
        INSERT INTO chat_history (session_id, user_message, bot_response)
        VALUES ($1, $2, $3)
    ''', session_id, user_message, bot_response)
    await conn.close()

async def get_history(session_id: str):
    conn = await asyncpg.connect(DATABASE_URL)
    rows = await conn.fetch('''
        SELECT user_message, bot_response FROM chat_history
        WHERE session_id = $1
        ORDER BY created_at ASC
    ''', session_id)
    await conn.close()
    return [{"role": "user", "content": row["user_message"], "role": "assistant", "content": row["bot_response"]} for row in rows]
