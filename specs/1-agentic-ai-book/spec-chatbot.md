# Feature Specification: RAG Chatbot

## Feature Branch
`feature/rag-chatbot`

## Overview
A chatbot embedded in the Agentic AI Book that answers user questions using the book's content as a knowledge base.

## User Requirements
- **UR-1**: Users can open a chat widget from any page.
- **UR-2**: Users can ask questions about Agentic AI concepts.
- **UR-3**: The bot answers referencing specific weeks/chapters.
- **UR-4**: The bot persists chat history for the session.

## Technical Requirements
- **TR-1**: Backend must be FastAPI.
- **TR-2**: Vector Store must be Qdrant.
- **TR-3**: Database for history must be Neon Postgres.
- **TR-4**: LLM integration via OpenAI SDK.
- **TR-5**: Frontend must be a React component in Docusaurus.

## Data Flow
1.  **Ingestion**: `docs/*.md` -> Split Sections -> OpenAI Embeddings -> Qdrant.
2.  **Query**: User Input -> API -> OpenAI Embedding -> Qdrant Search -> Context Construction -> OpenAI Completion -> Response.

## API Endpoints
- `POST /chat`:
    - Input: `{ message: string, session_id: string }`
    - Output: `{ response: string, sources: list[string] }`

## Success Criteria
- Bot answers "What is ReAct?" correctly based on Week 5 content.
- Chat UI is responsive and non-intrusive.
