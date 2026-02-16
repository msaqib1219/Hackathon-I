---
sidebar_label: "Week 8: Memory"
sidebar_position: 8
title: "Week 8: Memory Systems"
description: "How agents remember: from goldfish to elephant."
---

# Week 8: Memory Systems

## Why This Matters

Imagine visiting a doctor who forgets everything between appointments. Every time you go, you'd have to explain your entire medical history from scratch. That's what a **stateless** AI agent is like — it has no memory between conversations.

Memory is what transforms a generic assistant into a **personal** assistant. It's the difference between an AI that asks "What's your name?" every time, and one that says "Welcome back, Ahmed! How's that knee injury from last week?"

## Daily Life Use Case: Your Favorite Restaurant Waiter

Think about a waiter at a restaurant you visit regularly:

- **First visit**: "What would you like?" (no memory of you)
- **Third visit**: "The usual chai?" (remembers your order — **short-term memory**)
- **After months**: "You always sit by the window, you're allergic to nuts, and you love the mutton karahi." (accumulated knowledge — **long-term memory**)
- **After you mention a birthday**: "Last time you mentioned your anniversary is in March — should I reserve your favorite table?" (**episodic memory** — remembers specific events)

AI agents need the same types of memory to be truly helpful.

## Core Concepts

### 1. Short-Term Memory (Context Window)

Short-term memory is the **conversation happening right now**. In AI terms, this is the **context window** we learned about in Week 2.

- It holds the current conversation history
- It has a size limit (tokens)
- When it fills up, old messages get pushed out (forgotten)
- It resets when you start a new conversation

**Analogy**: Short-term memory is like a whiteboard. You can write on it during a meeting, but when the meeting ends, the board gets erased.

| Model | Context Window | Equivalent to |
|-------|---------------|---------------|
| GPT-4 | ~128K tokens | ~100 pages of text |
| Gemini 1.5 | ~1M tokens | ~750 pages of text |
| Claude 3.5 | ~200K tokens | ~150 pages of text |

### 2. Long-Term Memory (Persistent Storage)

Long-term memory is information that **persists across conversations**. It's stored externally — in databases, files, or vector stores.

```
┌─────────────────────────────────────────┐
│           LONG-TERM MEMORY              │
│                                         │
│  User Preferences  │  Past Interactions │
│  ─────────────── │  ──────────────── │
│  Name: Ahmed       │  March 3: Asked    │
│  Language: Urdu     │  about Python      │
│  Diet: No nuts      │  March 10: Asked   │
│  Skill: Beginner    │  about AI agents   │
└─────────────────────────────────────────┘
```

**Analogy**: Long-term memory is like a filing cabinet. Information is stored permanently and can be retrieved when needed.

### 3. Types of Memory

AI agents use several types of memory, inspired by how human memory works:

| Memory Type | What it stores | Human analogy | AI implementation |
|-------------|---------------|---------------|-------------------|
| **Working memory** | Current task state | Holding a phone number while dialing | Context window |
| **Episodic memory** | Specific past events | "Remember that time we went to Lahore?" | Conversation logs in a database |
| **Semantic memory** | Facts and knowledge | "Islamabad is the capital of Pakistan" | RAG knowledge base (Week 6) |
| **Procedural memory** | How to do things | Riding a bike (muscle memory) | Saved prompts, fine-tuned models |

### 4. Memory Management Strategies

Since the context window has limits, agents need strategies for what to remember and what to forget:

**Strategy 1: Summarization**
Instead of keeping every message, summarize old conversations:
- Full history: 50,000 tokens (won't fit!)
- Summary: "User is Ahmed, a student in Karachi studying AI. He's been working on a RAG chatbot project." — 30 tokens

**Strategy 2: Recency**
Keep recent messages in full detail, older ones as summaries:
```
[Summary of conversations 1-10]
[Full text of conversation 11]
[Full text of conversation 12]  ← Current
```

**Strategy 3: Relevance**
Only retrieve memories relevant to the current conversation:
- User asks about cooking → retrieve food preferences
- User asks about studying → retrieve education history
- Don't load everything at once!

### 5. Vector Memory (Connecting to Week 6)

Remember embeddings and vector databases from Week 6? They're perfect for long-term memory too!

When an agent has a new conversation, it can:
1. **Search** past conversations for relevant context
2. **Retrieve** the most useful memories
3. **Include** them in the current context

This is the same RAG pipeline, but applied to the agent's own history instead of external documents.

## How It Works: A Fitness Coach Agent with Memory

Imagine an AI fitness coach that uses all memory types:

**Day 1 — First Session**
```
Working Memory: "User just said they want to lose weight"
Action: Ask about current fitness level, diet, goals

Agent stores to Long-Term Memory:
- Name: Sarah
- Goal: Lose 10 kg
- Current weight: 75 kg
- Exercise history: Sedentary
- Diet: Pakistani cuisine, no seafood allergy
- Available equipment: None (home workouts only)
```

**Day 7 — Second Session**
```
Agent retrieves from Long-Term Memory: Sarah's profile

Agent: "Welcome back Sarah! How did the walking routine go
this week? Any soreness from the bodyweight exercises?"

Episodic Memory recalls: Last session recommended 30-min
daily walks + 3 bodyweight exercises

Sarah: "The walks were great but squats hurt my knees."

Agent updates memory: "Sarah has knee sensitivity — avoid
deep squats, suggest alternatives"
```

**Day 30 — Progress Check**
```
Agent retrieves: Full history, compares weight logs

Agent: "Sarah, you've been consistent for a month! You
started at 75 kg and you're now at 73 kg. The knee-friendly
exercises seem to be working. Ready to increase intensity?"

Semantic Memory: Knows that 0.5 kg/week is healthy loss
Episodic Memory: Remembers the knee issue from Day 7
Working Memory: Current conversation about progress
```

## Real-World Applications

- **Personalized shopping (Amazon, Daraz)**: Remembers your browsing history, purchase patterns, and preferences to recommend relevant products.
- **Healthcare follow-ups**: An AI health assistant remembers your medications, allergies, and past symptoms to provide consistent advice.
- **Education tutors**: Khan Academy's AI remembers which topics you struggled with and revisits them. It tracks your progress over weeks and months.
- **Customer support**: "I see you called about this issue last week. Let me check the status of your case" — the agent retrieves past interaction logs.

## Try It Yourself

### Exercise 1: Design a Memory System
Design the memory system for an AI **study tutor**. What should it remember?

Fill in this template:
```
Short-term memory (current session):
- ...

Long-term memory (across sessions):
- User profile: ...
- Subject progress: ...
- ...

Episodic memory (specific events):
- ...

What should it forget/summarize?
- ...
```

### Exercise 2: Memory vs. No Memory
Have a conversation with ChatGPT about a topic across multiple messages. Then start a **new conversation** and ask a follow-up question. Notice how it has no memory of the previous chat — this is the problem we're solving.

### Exercise 3: Summarization Challenge
Take a long WhatsApp conversation and try to summarize it in 2-3 sentences that capture the key information. This is what agents do to manage memory.

### Exercise 4: Memory Retrieval
Imagine you're an AI assistant with these stored memories about a user:
- "Prefers window seats on flights"
- "Is vegetarian"
- "Works as a software developer"
- "Has a meeting every Monday at 9 AM"

The user asks: "Book me a flight to Dubai next Monday." Which memories are relevant to retrieve? Which are irrelevant?

## Key Takeaways

- **Short-term memory** (context window) holds the current conversation but has size limits and resets between sessions.
- **Long-term memory** persists across conversations using databases and vector stores.
- Agents use different memory types: **working**, **episodic**, **semantic**, and **procedural** — mirroring human memory.
- **Memory management** strategies (summarization, recency, relevance) help agents work within token limits.
- Memory is what transforms a generic AI into a **personalized assistant** that knows you.

## Quiz: Check Your Understanding

1. **What is "short-term memory" in an AI agent?**
   - a) The agent's training data
   - b) The current conversation context window
   - c) A database of all past conversations
   - d) The agent's knowledge of the world

2. **Why do agents need long-term memory?**
   - a) To be faster
   - b) To remember information across conversations and sessions
   - c) To use more electricity
   - d) Long-term memory isn't needed

3. **What is episodic memory?**
   - a) Memory from TV episodes
   - b) Memory of specific past events and interactions
   - c) Memory of general facts
   - d) Memory that lasts one episode

4. **What is "summarization" in memory management?**
   - a) Writing a book summary
   - b) Condensing old conversations into short summaries to save token space
   - c) Deleting old memories
   - d) Making memories longer

5. **A fitness AI remembers your knee injury from last month. What type of memory is this?**
   - a) Working memory
   - b) Semantic memory
   - c) Episodic memory
   - d) Procedural memory

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-c

---

*Next week: What happens when one agent isn't enough? We explore multi-agent orchestration — teams of AI working together.*
