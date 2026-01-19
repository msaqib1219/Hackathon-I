import os
import glob
from typing import List
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

# Load environment variables
load_dotenv()

# Initialize clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

COLLECTION_NAME = "agentic_ai_book"

def get_embedding(text: str) -> List[float]:
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

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
        point = PointStruct(
            id=hash(f"{filename}_{i}"),  # Simple deterministic ID
            vector=embedding,
            payload={
                "source": filename,
                "text": chunk,
            }
        )
        points.append(point)

    return points

def ingest_docs():
    # Create collection if not exists
    if not qdrant_client.collection_exists(COLLECTION_NAME):
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
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
