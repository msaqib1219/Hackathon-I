---
sidebar_label: "Week 6: RAG"
sidebar_position: 6
title: "Week 6: External Knowledge (RAG)"
description: "Giving your agent a library: Retrieval Augmented Generation."
---

# Week 6: External Knowledge (RAG)

## Why This Matters

AI models are trained on massive amounts of data, but that training has a cutoff date. They don't know about yesterday's news, your company's internal documents, or the textbook you're studying from. **RAG (Retrieval Augmented Generation)** solves this by giving the agent access to external knowledge — like giving a student a textbook during an exam.

Fun fact: **the chatbot on this very website uses RAG!** It retrieves relevant passages from this book's content using a vector database (Qdrant) and feeds them to Gemini to answer your questions.

## Daily Life Use Case: Ctrl+F in a Textbook

Imagine you're taking an open-book exam. The question asks: *"What are the three types of memory in AI agents?"*

You don't read the entire 300-page textbook. Instead, you:

1. **Think about keywords**: "memory types," "agent memory"
2. **Search** (Ctrl+F): Look for those keywords in the textbook
3. **Find relevant passages**: Pages 142-145 discuss short-term, long-term, and episodic memory
4. **Read the relevant section**: Absorb just those 3 pages
5. **Write your answer**: Using the retrieved information, combined with your own understanding

This is exactly what RAG does — but instead of Ctrl+F, it uses **math** (vector search) to find the most relevant information.

## Core Concepts

### 1. The Problem: Knowledge Cutoff

Every AI model has a **knowledge cutoff** — a date after which it knows nothing.

| Model | Training Cutoff | What it doesn't know |
|-------|----------------|---------------------|
| GPT-4 | ~April 2024 | Anything after April 2024 |
| Gemini | ~Late 2024 | Your company's private documents |
| Any model | Any date | Your personal notes, proprietary data |

Even within its training data, the model might have *seen* information but not *memorized* it accurately. RAG provides a reliable source of truth.

### 2. Embeddings: Turning Words into Coordinates

To search for relevant information, we need to understand *meaning*, not just match keywords. **Embeddings** convert text into numerical coordinates in a "meaning space."

Think of it like a map. Words with similar meanings are placed close together:

```
                    "happy"  "joyful"  "glad"
                         ●      ●       ●

      "temperature"              "weather"  "climate"
           ●                        ●          ●

                    "sad"  "unhappy"  "miserable"
                      ●       ●          ●
```

When you search for "feeling good," the system finds "happy," "joyful," and "glad" because they're nearby in meaning-space — even though none of them contain the word "good."

$$ \text{similarity}(\vec{a}, \vec{b}) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \times |\vec{b}|} $$

This formula (cosine similarity) measures how close two meanings are. A value of 1.0 means identical meaning; 0.0 means completely unrelated.

### 3. The RAG Pipeline

RAG has two phases: **Indexing** (one-time setup) and **Querying** (every time a user asks a question).

#### Phase 1: Indexing (Store the knowledge)

```
Your Documents (PDF, web pages, notes)
         │
         ▼
┌─────────────────┐
│  Split into      │  "Chunking" — break into
│  small pieces    │  paragraphs or sections
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Convert each    │  Turn text into number
│  chunk to        │  vectors (embeddings)
│  embedding       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Store in        │  Save vectors in a
│  vector database │  searchable database
└─────────────────┘
```

#### Phase 2: Querying (Answer a question)

```
User Question: "What is the ReAct framework?"
         │
         ▼
┌─────────────────┐
│  Convert question│  Same embedding process
│  to embedding    │  as indexing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Search vector   │  Find the 3-5 most
│  database        │  similar chunks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Retrieved chunks│  "ReAct combines reasoning
│  (context)       │   and acting in a loop..."
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Send to AI:     │  "Using this context,
│  context +       │   answer the user's
│  question        │   question"
└────────┬────────┘
         │
         ▼
AI Answer: "The ReAct framework combines
reasoning and acting in a loop where the
agent thinks, takes an action, observes
the result, and thinks again..."
```

### 4. Chunking: Breaking Documents into Pieces

You can't feed an entire book into the AI's context window. Instead, documents are split into **chunks** — small, meaningful pieces.

| Chunking Strategy | How it works | Best for |
|------------------|-------------|----------|
| **Fixed size** | Every 500 words | Simple documents |
| **By paragraph** | Split at paragraph breaks | Well-structured text |
| **By section** | Split at headings (H1, H2) | Books, manuals, docs |
| **Overlapping** | Chunks overlap by 50-100 words | Preserving context across boundaries |

**Why overlap?** Imagine a sentence at the boundary of two chunks: "The ReAct framework, as described in | the previous chapter, combines..." Without overlap, this sentence gets split and loses meaning.

### 5. Vector Databases

A vector database is a specialized database for storing and searching embeddings. Popular options include:

| Database | Type | Used by |
|----------|------|---------|
| **Qdrant** | Cloud/Self-hosted | This website's chatbot! |
| **Pinecone** | Cloud | Many production apps |
| **ChromaDB** | Local/Lightweight | Prototypes and experiments |
| **FAISS** | Library (Facebook) | Research projects |

## How It Works: This Website's RAG Chatbot

The chatbot you see on this website follows the exact RAG pipeline described above:

1. **Indexing**: All 12 weeks of book content were split into chunks and converted to embeddings using Gemini's embedding model.
2. **Storage**: Those embeddings are stored in **Qdrant** (a cloud vector database).
3. **When you ask a question**: Your question is embedded, Qdrant finds the 3 most similar chunks, and those chunks are sent to **Gemini** along with your question.
4. **Gemini responds**: Using the retrieved context, Gemini generates an accurate answer based on the book's actual content.

This is why the chatbot can answer questions about this specific book — it's not relying on Gemini's general knowledge, it's looking up the actual text!

## Real-World Applications

- **Customer support**: Companies feed their FAQ, product manuals, and help articles into a RAG system. When a customer asks "How do I reset my password?", the system retrieves the specific steps from the knowledge base.
- **Legal research**: Lawyers use RAG to search through thousands of case files and legal documents to find relevant precedents.
- **Medical literature**: Doctors use RAG to search medical research papers when diagnosing rare conditions.
- **Enterprise search**: Companies use RAG so employees can ask natural language questions about internal documents, policies, and procedures.

## Try It Yourself

### Exercise 1: Use the RAG Chatbot
Try our book's chatbot (available on this site) and ask it:
- "What is the ReAct framework?" (it should retrieve content from Week 5)
- "How do agents use memory?" (it should retrieve content from Week 8)
- "What is the weather in Karachi?" (it should say it doesn't know — this isn't in the book!)

The third question tests whether the chatbot correctly says "I don't know" for questions outside its knowledge base.

### Exercise 2: The Ctrl+F Analogy
Take any PDF or article and try to answer a question using only Ctrl+F:
1. Think of good search keywords
2. Find the relevant section
3. Read just that section
4. Write your answer

Now think: what would be different if you could search by *meaning* instead of keywords?

### Exercise 3: Chunking Practice
Take the first page of any Wikipedia article and try splitting it into chunks:
- First try 2-sentence chunks
- Then try paragraph-based chunks
- Which chunks would be more useful for answering questions?

### Exercise 4: Embedding Intuition
Group these words by meaning (which ones would be "close" in embedding space?):

*car, happy, automobile, joyful, vehicle, sad, truck, cheerful, depressed, van*

**Cluster 1** (emotions - positive): happy, joyful, cheerful
**Cluster 2** (emotions - negative): sad, depressed
**Cluster 3** (vehicles): car, automobile, vehicle, truck, van

This is essentially what embeddings do mathematically!

## Key Takeaways

- **RAG** gives AI agents access to external knowledge that isn't in their training data.
- **Embeddings** convert text into mathematical coordinates where similar meanings are close together.
- The RAG pipeline: **Chunk documents → Embed → Store in vector DB → Search → Augment prompt → Generate answer**.
- **Chunking strategy** matters — too large and you waste context, too small and you lose meaning.
- RAG is used everywhere: customer support, legal research, medical AI, and enterprise search.
- **This website's chatbot** is a working RAG system using Qdrant + Gemini!

## Quiz: Check Your Understanding

1. **What does RAG stand for?**
   - a) Random Answer Generator
   - b) Retrieval Augmented Generation
   - c) Real-time AI Gateway
   - d) Rapid Automated Guessing

2. **Why do AI models need RAG?**
   - a) They are too slow without it
   - b) They have a knowledge cutoff and can't access private/recent data on their own
   - c) RAG makes them cheaper to run
   - d) Without RAG, AI models don't work at all

3. **What are embeddings?**
   - a) Images embedded in documents
   - b) Numerical representations of text meaning, where similar meanings have similar numbers
   - c) A type of database
   - d) HTML embed tags

4. **What is "chunking" in RAG?**
   - a) Deleting unwanted data
   - b) Breaking documents into smaller, searchable pieces
   - c) Compressing files
   - d) A type of encryption

5. **Why might a RAG chatbot say "I don't know"?**
   - a) It's broken
   - b) The question's answer isn't in the knowledge base it searches
   - c) It's being lazy
   - d) The internet is down

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-b

---

*Next week: We move from individual skills to higher-level architecture — how agents plan and decompose complex goals into manageable steps.*
