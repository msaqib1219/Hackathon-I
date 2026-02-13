import os
import glob
from typing import List
from dotenv import load_dotenv
from google import genai
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

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

def get_embedding(text: str) -> List[float]:
    """Generate embedding using Gemini"""
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text
    )
    return result.embeddings[0].values

def chunk_text(text: str, chunk_size: int = 1000) -> List[str]:
    # Simple chunking for now, could be improved with tiktoken
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def process_file(file_path: str):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(file_path)
    chunks = chunk_text(content)
    points = []

    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        # Use absolute value of hash to ensure positive ID
        point_id = abs(hash(f"{filename}_{i}"))
        point = PointStruct(
            id=point_id,
            vector=embedding,
            payload={
                "source": filename,
                "text": chunk,
            }
        )
        points.append(point)

    return points

def ingest_docs():
    # Create collection if not exists, or recreate if dimensions mismatch
    if qdrant_client.collection_exists(COLLECTION_NAME):
        # Check if we need to recreate due to dimension mismatch
        collection_info = qdrant_client.get_collection(COLLECTION_NAME)
        if collection_info.config.params.vectors.size != 3072:
            print(f"Deleting collection due to dimension mismatch (expected 3072, got {collection_info.config.params.vectors.size})")
            qdrant_client.delete_collection(COLLECTION_NAME)
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=3072, distance=Distance.COSINE),  # Gemini gemini-embedding-001 is 3072 dims
            )
            print(f"Recreated collection: {COLLECTION_NAME}")
        else:
            print(f"Collection {COLLECTION_NAME} already exists with correct dimensions")
    else:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=3072, distance=Distance.COSINE),  # Gemini gemini-embedding-001 is 3072 dims
        )
        print(f"Created collection: {COLLECTION_NAME}")

    docs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs", "*.md")
    files = glob.glob(docs_path)

    all_points = []
    for file_path in files:
        print(f"Processing {file_path}...")
        points = process_file(file_path)
        all_points.extend(points)

    if all_points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=all_points
        )
        print(f"Ingested {len(all_points)} chunks from {len(files)} files.")

if __name__ == "__main__":
    ingest_docs()
