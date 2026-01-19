import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from contextlib import asynccontextmanager

from database import init_db, add_message, get_history

load_dotenv()

# Initialize clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
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
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # 1. Retrieve relevant context
        embedding = get_embedding(request.message)
        search_result = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=embedding,
            limit=3
        )

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

        # 3. Call LLM
        completion = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )

        response_text = completion.choices[0].message.content

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
