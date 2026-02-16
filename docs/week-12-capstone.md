---
sidebar_label: "Week 12: Capstone"
sidebar_position: 12
title: "Week 12: Building the Capstone"
description: "Synthesizing all concepts into a personal 'Autonomous Assistant'."
---

# Week 12: Building the Capstone

## Why This Matters

You've spent 11 weeks learning individual concepts — agents, prompts, reasoning, tools, ReAct, RAG, planning, memory, orchestration, error handling, and ethics. Now it's time to **put it all together**.

This is like learning to drive: you practiced steering, braking, using mirrors, and parking separately. Now you drive in traffic, using all skills simultaneously without thinking about each one individually.

Your capstone project is to **design and build your own AI agent** that solves a real problem. This chapter gives you the blueprint.

## Daily Life Use Case: Building a House

Building a house brings together every trade:
- **Foundation** (Weeks 1-3): The engine — understanding agents, language, and reasoning
- **Walls and structure** (Weeks 4-6): The tools — function calling, ReAct, and RAG
- **Plumbing and wiring** (Weeks 7-9): The architecture — planning, memory, and orchestration
- **Safety and finishing** (Weeks 10-11): Error handling and ethics
- **Move in** (Week 12): Integration and deployment — making it all work together

No single trade builds a house alone. Similarly, no single concept from this course makes a useful agent. The power is in the **combination**.

## The Capstone Formula

Everything you've learned connects:

$$ \sum_{i=1}^{n} (Reasoning_i + Action_i) \times Safety = \text{Robust Autonomy} $$

In plain language: An agent that **reasons well** and **acts effectively**, multiplied by **safety and ethics**, produces **robust autonomy** — an agent you can trust.

## Core Concepts

### 1. System Design: The Big Picture

Before writing a single line of code, design your system. Every agent needs these components:

```
┌──────────────────────────────────────────────────────┐
│                   YOUR AI AGENT                       │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │   INPUT      │  │   BRAIN      │  │   OUTPUT    ││
│  │             │  │              │  │             ││
│  │ User message│  │ LLM (Gemini,│  │ Response    ││
│  │ Context     │  │ GPT, Claude) │  │ Actions     ││
│  │ History     │  │ + System     │  │ Tool calls  ││
│  │             │  │   Prompt     │  │             ││
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘│
│         │                │                  │        │
│         │         ┌──────┴───────┐         │        │
│         │         │              │         │        │
│    ┌────┴────┐   │   TOOLKIT    │   ┌────┴─────┐  │
│    │ MEMORY  │   │              │   │GUARDRAILS│  │
│    │         │   │ APIs, Search,│   │          │  │
│    │ Short & │   │ Database,    │   │ Input    │  │
│    │ Long    │   │ Calculator   │   │ Output   │  │
│    │ term    │   │              │   │ Safety   │  │
│    └─────────┘   └──────────────┘   └──────────┘  │
└──────────────────────────────────────────────────────┘
```

### 2. Choosing Your Project

Pick a project that's challenging enough to demonstrate your skills but scoped enough to complete. Here are three recommended capstone projects:

#### Option A: Personal Study Assistant
An AI agent that helps you study from your own notes and textbooks.

| Component | How it maps to the course |
|-----------|--------------------------|
| **Agent loop** (Week 1) | Takes questions, reasons, responds |
| **Prompting** (Week 2) | System prompt defines the tutor persona |
| **Reasoning** (Week 3) | Chain of Thought for explaining concepts step by step |
| **Tools** (Week 4) | Calculator for math, web search for current info |
| **ReAct** (Week 5) | Think about what the student needs → search notes → explain |
| **RAG** (Week 6) | Retrieve relevant sections from uploaded study material |
| **Planning** (Week 7) | Create study plans and break down topics |
| **Memory** (Week 8) | Remember what topics the student has covered and struggles with |
| **Orchestration** (Week 9) | Quiz agent + explanation agent + progress tracking agent |
| **Error handling** (Week 10) | Say "I don't know" when the answer isn't in the notes |
| **Ethics** (Week 11) | Don't write assignments for the student; help them learn |

#### Option B: Customer Support Agent
An AI agent that handles customer inquiries for a small business.

| Component | How it maps to the course |
|-----------|--------------------------|
| **Agent loop** (Week 1) | Receives customer messages, processes, responds |
| **Prompting** (Week 2) | Polite, helpful persona with company knowledge |
| **Reasoning** (Week 3) | Diagnose customer issues step by step |
| **Tools** (Week 4) | Look up orders, check inventory, process returns |
| **ReAct** (Week 5) | Understand issue → check records → propose solution |
| **RAG** (Week 6) | Search FAQ and policy documents for accurate answers |
| **Planning** (Week 7) | Multi-step issue resolution (escalation paths) |
| **Memory** (Week 8) | Remember past interactions with each customer |
| **Orchestration** (Week 9) | Triage agent → specialist agents (billing, technical, returns) |
| **Error handling** (Week 10) | Escalate to human when confidence is low |
| **Ethics** (Week 11) | Don't share customer data; be honest about limitations |

#### Option C: News Briefing Agent
An AI agent that creates personalized daily news briefings.

| Component | How it maps to the course |
|-----------|--------------------------|
| **Agent loop** (Week 1) | Gather news, filter, summarize, deliver |
| **Prompting** (Week 2) | "You are a news editor who creates concise briefings" |
| **Reasoning** (Week 3) | Evaluate source credibility, identify key stories |
| **Tools** (Week 4) | News APIs, web scraping, RSS feeds |
| **ReAct** (Week 5) | Search for news → evaluate relevance → summarize |
| **RAG** (Week 6) | Reference past briefings for context and follow-ups |
| **Planning** (Week 7) | Organize stories by category, plan briefing structure |
| **Memory** (Week 8) | Remember user's interests and reading history |
| **Orchestration** (Week 9) | Research agent + writer agent + fact-checker agent |
| **Error handling** (Week 10) | Flag unverified stories, cite sources |
| **Ethics** (Week 11) | Present balanced views, avoid filter bubbles |

### 3. The Design Document

Before building, write a design document. This is your blueprint:

```
╔══════════════════════════════════════════════════════╗
║              CAPSTONE DESIGN DOCUMENT                ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  1. PROBLEM STATEMENT                                ║
║     What problem does your agent solve?              ║
║     Who is it for?                                   ║
║                                                      ║
║  2. AGENT ARCHITECTURE                               ║
║     • Input: What does the agent receive?            ║
║     • Brain: Which LLM? What system prompt?          ║
║     • Tools: What tools does it need?                ║
║     • Memory: What does it remember?                 ║
║     • Output: What does it produce?                  ║
║                                                      ║
║  3. ORCHESTRATION                                    ║
║     • Single agent or multi-agent?                   ║
║     • If multi: what pattern? (coordinator,          ║
║       pipeline, swarm, handoff)                      ║
║                                                      ║
║  4. DATA SOURCES                                     ║
║     • What knowledge does the agent need?            ║
║     • RAG: What documents to index?                  ║
║     • APIs: What external services to connect?       ║
║                                                      ║
║  5. SAFETY & ETHICS                                  ║
║     • What guardrails are needed?                    ║
║     • What actions need human approval?              ║
║     • What could go wrong? How to prevent it?        ║
║                                                      ║
║  6. TESTING PLAN                                     ║
║     • How will you test it works correctly?          ║
║     • What edge cases should you test?               ║
║     • How will you test for bias?                    ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

### 4. Building Step by Step

Follow this order. Each step builds on the previous one:

**Step 1: Start with the brain (30 minutes)**
- Choose your LLM (Gemini, GPT, Claude — free tiers work fine)
- Write a system prompt that defines your agent's role, personality, and rules
- Test: Can it have a basic conversation about the topic?

**Step 2: Add tools (1 hour)**
- Define 2-3 tools your agent needs (start simple!)
- Connect them using function calling (Week 4)
- Test: Can it use tools correctly?

**Step 3: Implement ReAct (1 hour)**
- Structure the agent to Think → Act → Observe
- Add stopping conditions
- Test: Does it reason before acting? Does it stop when done?

**Step 4: Add knowledge (1-2 hours)**
- If using RAG: chunk your documents, create embeddings, set up vector search
- If using APIs: connect to data sources
- Test: Can it answer questions using the knowledge base?

**Step 5: Add memory (30 minutes)**
- Implement conversation history (short-term)
- Add persistent storage for user preferences (long-term)
- Test: Does it remember context within and across conversations?

**Step 6: Add guardrails (30 minutes)**
- Input validation (block harmful requests)
- Output validation (check for hallucination, filter sensitive data)
- Error handling (fallback strategies)
- Test: What happens when you give it bad input? Does it fail gracefully?

**Step 7: Test and iterate (ongoing)**
- Test with real users (friends, classmates)
- Collect feedback
- Fix issues and improve

### 5. Tools You Can Use (All Free)

| Tool | What it does | Free tier |
|------|-------------|-----------|
| **Google Gemini API** | LLM for reasoning and generation | 15 RPM free |
| **OpenAI API** | GPT models | $5 free credit for new accounts |
| **Anthropic API** | Claude models | Free tier available |
| **Qdrant** | Vector database for RAG | 1GB free cloud |
| **ChromaDB** | Local vector database | Fully free (runs locally) |
| **Streamlit** | Build web UI for your agent | Free hosting |
| **Gradio** | Alternative web UI | Free hosting on HuggingFace |
| **LangChain** | Framework for building agents | Open source |
| **Python** | Programming language | Free |

## How It Works: Study Assistant — End-to-End Example

Here's a complete example of how the Study Assistant capstone works:

**Setup (one-time)**:
```
1. Upload study materials (PDFs, notes)
2. System chunks documents and creates embeddings
3. Embeddings stored in vector database (Qdrant/ChromaDB)
4. System prompt configured: "You are a patient study tutor..."
```

**User interaction**:
```
Student: "Explain the ReAct framework in simple terms"

┌─ Agent Processing ─────────────────────────────────┐
│                                                     │
│ Memory Check: Student has studied Weeks 1-4.       │
│ This is Week 5 content — appropriate level.         │
│                                                     │
│ Thought: I should retrieve the relevant section    │
│ from the study material first, then explain at     │
│ the student's level.                                │
│                                                     │
│ Action: search_knowledge_base("ReAct framework")   │
│                                                     │
│ Observation: Retrieved 3 chunks from Week 5 notes: │
│ - "ReAct = Reasoning + Acting..."                  │
│ - "The loop: Think → Act → Observe..."             │
│ - "Error recovery in ReAct..."                     │
│                                                     │
│ Thought: The student is a beginner. I should use   │
│ a daily-life analogy and keep it simple.           │
│                                                     │
│ Guardrail Check: Response is educational,          │
│ grounded in source material. ✓                     │
│                                                     │
│ Response: "Think of ReAct like online shopping:    │
│ You THINK about what you need, ACT by searching,   │
│ OBSERVE the results, then THINK again about        │
│ whether to refine your search or buy. AI agents    │
│ do the same: reason about the problem, use a tool, │
│ see the result, then decide what to do next.       │
│ It keeps looping until the goal is met!"           │
│                                                     │
│ Memory Update: Student asked about ReAct.          │
│ Mark Week 5 as "in progress" in their profile.     │
└─────────────────────────────────────────────────────┘
```

**Follow-up**:
```
Student: "Can you quiz me on what we've covered?"

Agent retrieves: Topics covered so far (Weeks 1-5)
Agent generates: 5 quiz questions, one per week
Agent remembers: Which questions the student gets wrong
Agent suggests: "You might want to review Week 3 (Reasoning)
                 — you got that question wrong."
```

## The Capstone Checklist

Use this checklist to evaluate your project:

```
CAPSTONE EVALUATION CHECKLIST
═══════════════════════════════════════════

Core Functionality
□ Agent can understand and respond to user input
□ Agent uses at least 2 tools effectively
□ Agent follows the ReAct pattern (Think → Act → Observe)
□ Agent accesses external knowledge (RAG or APIs)

Intelligence
□ Agent reasons step by step (Chain of Thought)
□ Agent creates plans for complex tasks
□ Agent remembers context within a conversation
□ Agent remembers user preferences across sessions

Robustness
□ Agent handles errors gracefully (doesn't crash)
□ Agent says "I don't know" when appropriate
□ Agent has input validation (rejects bad input)
□ Agent has output validation (no harmful content)

Ethics & Safety
□ Agent has clear boundaries (what it won't do)
□ High-risk actions require human approval
□ Agent doesn't exhibit obvious bias
□ Agent's reasoning is transparent (traceable)

User Experience
□ Agent is helpful and accurate
□ Agent communicates its confidence level
□ Agent asks clarifying questions when needed
□ Agent is pleasant to interact with
```

## Presentation Guide

When presenting your capstone, structure it as:

1. **The Problem** (1 minute): What problem does your agent solve? Who benefits?
2. **Demo** (3 minutes): Show the agent working — a live demo with a realistic scenario
3. **Architecture** (2 minutes): Show your system design diagram. Explain the components.
4. **Challenges** (1 minute): What was hard? What did you learn?
5. **Ethics** (1 minute): What guardrails did you implement? What could go wrong?
6. **Future** (1 minute): If you had more time, what would you add?

## Real-World Applications

Everything in this course maps directly to products millions of people use daily:

| Course Concept | Real Product |
|---------------|-------------|
| Agent architecture (Week 1) | Siri, Alexa, Google Assistant |
| Prompt engineering (Week 2) | ChatGPT, Claude, Gemini |
| Chain of Thought (Week 3) | OpenAI o1, Google's reasoning models |
| Function calling (Week 4) | ChatGPT plugins, Gemini Actions |
| ReAct framework (Week 5) | AI coding assistants (Claude Code, Cursor, GitHub Copilot) |
| RAG (Week 6) | Perplexity AI, enterprise search tools |
| Planning (Week 7) | AI project managers (Linear, Notion AI) |
| Memory (Week 8) | ChatGPT memory, personalized assistants |
| Multi-agent systems (Week 9) | AutoGen, CrewAI, multi-agent customer support |
| Error handling (Week 10) | Every production AI system |
| Ethics & safety (Week 11) | EU AI Act compliance, responsible AI frameworks |
| **Integration** (Week 12) | **Your capstone project!** |

## Try It Yourself

### Exercise 1: Choose and Design
Pick one of the three capstone options (Study Assistant, Customer Support, or News Briefing) and fill out the Design Document template from Section 3. Be specific about every component.

### Exercise 2: Build the Core
Start with Steps 1-3 from Section 4:
1. Set up your LLM with a system prompt
2. Add at least 2 tools
3. Implement the ReAct loop

Even without RAG or memory, you should have a functional (basic) agent at this point.

### Exercise 3: Add Intelligence
Add RAG (Step 4) and memory (Step 5) to your agent. Test these questions:
- Can it answer questions from your knowledge base?
- Does it remember what you discussed earlier in the conversation?
- Does it say "I don't know" for questions outside its knowledge?

### Exercise 4: Harden and Present
Add guardrails (Step 6) and run through the Capstone Checklist. Then:
- Find 2-3 people to test your agent
- Collect their feedback
- Fix the top 3 issues they found
- Prepare your presentation using the Presentation Guide

## Key Takeaways

- A complete AI agent combines **all 11 weeks**: perception, language, reasoning, tools, ReAct, RAG, planning, memory, orchestration, error handling, and ethics.
- **Design before you build** — a good design document prevents wasted effort and keeps you focused.
- Build **incrementally**: start with the brain, add tools, then knowledge, then memory, then guardrails.
- **Test with real users** — your assumptions about what's useful will be wrong in surprising ways.
- The capstone formula: **Reasoning + Action + Safety = Robust Autonomy**.
- Everything in this course maps to **real products** used by millions of people — you now understand how they work.

## Final Words

You started this course with a question: *"What is an AI agent?"*

Now you can answer it: An AI agent is a system that **perceives** its environment, **reasons** about what to do, **acts** using tools, **learns** from the results, and does all of this while being **safe, ethical, and transparent**.

More importantly, you can **build one**.

The field of AI agents is still young. The frameworks, tools, and best practices are evolving rapidly. What you've learned here is the foundation — the principles that will remain true regardless of which specific LLM or framework is popular next year.

Keep building. Keep learning. Keep asking "What if an agent could...?"

$$ \sum_{i=1}^{n} (Reasoning_i + Action_i) \times Safety = \text{Robust Autonomy} $$

## Quiz: Check Your Understanding

1. **What is the correct order for building an agent?**
   - a) Tools → Brain → Memory → Guardrails
   - b) Brain → Tools → ReAct → Knowledge → Memory → Guardrails
   - c) Guardrails → Brain → Tools → Memory
   - d) Memory → Knowledge → Brain → Tools

2. **Why should you write a design document before building?**
   - a) It's a waste of time
   - b) It prevents wasted effort and ensures all components are considered before coding
   - c) Professors require it
   - d) It makes the project look professional

3. **What does the capstone formula represent?**
   - a) How to calculate AI costs
   - b) Reasoning + Action multiplied by Safety equals Robust Autonomy
   - c) A mathematical proof of AI intelligence
   - d) The speed of the agent

4. **Why should you test with real users?**
   - a) To show off your project
   - b) Because your assumptions about what's useful will be wrong in surprising ways
   - c) Real users are more fun
   - d) It's not necessary

5. **What is the most important thing you've learned in this course?**
   - a) How to use ChatGPT
   - b) How individual AI concepts (reasoning, tools, memory, safety) combine to create useful autonomous agents
   - c) How to write Python code
   - d) How to pass an exam

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-b

---

*Congratulations! You've completed the 12-week Agentic AI course. Now go build something amazing.*
