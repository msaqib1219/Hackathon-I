import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
import json
import re
from qdrant_client import QdrantClient
from contextlib import asynccontextmanager

from database import init_db, add_message, get_history

# Load environment variables FIRST (override=True to override system env vars)
load_dotenv(override=True)

# Configure Gemini AFTER loading .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Initialize the client with the new API
client = genai.Client(api_key=GEMINI_API_KEY)

# Initialize clients
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

COLLECTION_NAME = "agentic_ai_book"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await init_db()
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    sources: List[str]

def get_embedding(text: str) -> List[float]:
    """Generate embedding using Gemini"""
    result = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text
    )
    return result.embeddings[0].values


def extract_json_from_response(text: str) -> str:
    """Extract JSON from text response if present"""
    # Remove markdown code blocks
    text = re.sub(r'```json\n?', '', text)
    text = re.sub(r'```\n?', '', text)
    return text.strip()

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # 1. Retrieve relevant context
        embedding = get_embedding(request.message)
        search_result = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=embedding,
            limit=3
        ).points

        context_text = "\n\n".join([hit.payload["text"] for hit in search_result])
        sources = list(set([hit.payload["source"] for hit in search_result]))

        # 2. Construct prompt
        system_prompt = f"""You are a helpful assistant for the Agentic AI Book.
        Use the following context to answer the user's question.
        If the answer is not in the context, say you don't know.

        Context:
        {context_text}
        """

        user_message = request.message

        # 3. Call LLM using new google.genai API
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"{system_prompt}\n\nUser: {user_message}\n\nAssistant:",
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=2048,
                    safety_settings=[
                        types.SafetySetting(
                            category="HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold="BLOCK_ONLY_HIGH"
                        ),
                        types.SafetySetting(
                            category="HARM_CATEGORY_HATE_SPEECH",
                            threshold="BLOCK_ONLY_HIGH"
                        ),
                        types.SafetySetting(
                            category="HARM_CATEGORY_HARASSMENT",
                            threshold="BLOCK_ONLY_HIGH"
                        ),
                        types.SafetySetting(
                            category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold="BLOCK_ONLY_HIGH"
                        ),
                    ]
                )
            )

            response_text = response.text

        except Exception as e:
            print(f"Gemini API error: {e}")
            raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

        # 4. Save to history
        try:
            await add_message(request.session_id, user_message, response_text)
        except Exception as e:
            print(f"Warning: Failed to save to history: {e}")

        return ChatResponse(response=response_text, sources=sources)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
