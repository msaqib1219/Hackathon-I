---
sidebar_label: "Week 10: Errors"
sidebar_position: 10
title: "Week 10: Error Handling and Hallucination Management"
description: "What to do when the agent gets lost."
---

# Week 10: Error Handling and Hallucination Management

## Why This Matters

Every system fails eventually. Your phone crashes, your GPS loses signal, your calculator app gives a wrong answer if you type the wrong numbers. The question isn't *whether* an AI agent will make mistakes — it's **how it recovers** from them.

An agent that crashes on the first error is useless. An agent that confidently gives wrong answers is **dangerous**. This week, we learn how to build agents that fail gracefully, catch their own mistakes, and know when to say "I don't know."

## Daily Life Use Case: GPS Recalculating

You're driving to a wedding in Lahore using Google Maps. The GPS says "Turn left in 200 meters." But you miss the turn.

What happens next?

1. **Detection**: The GPS notices you didn't turn (your location doesn't match the expected route)
2. **Acknowledgment**: It says "Recalculating..." (it doesn't pretend you're still on the right road)
3. **Recovery**: It finds a new route from your current position
4. **Continuation**: It gives you the next instruction on the new route

Now imagine a **bad** GPS:
- It doesn't notice you missed the turn (no error detection)
- It keeps giving directions for the old route (no recovery)
- It confidently says "You have arrived!" when you're in the wrong city (hallucination)

AI agents face the same challenges. They need to detect errors, acknowledge them, and recover — just like a good GPS.

## Core Concepts

### 1. Hallucination: Confident Nonsense

**Hallucination** is when an AI generates information that sounds correct but is completely made up. It's the most dangerous type of error because it's hard to spot.

| Type of Hallucination | Example | Why it happens |
|----------------------|---------|----------------|
| **Factual** | "The Eiffel Tower is in London" | Model confuses or fabricates facts |
| **Fabricated sources** | "According to a 2023 study by Oxford..." (study doesn't exist) | Model generates plausible-sounding citations |
| **Numerical** | "Pakistan's population is 450 million" (it's ~240 million) | Model estimates instead of looking up |
| **Logical** | "Since all birds fly, penguins must fly" | Model follows a flawed chain of reasoning |
| **Outdated** | "The current PM of Pakistan is Imran Khan" | Training data cutoff |

**Why does hallucination happen?**

LLMs predict the **most likely next word**. They don't have a concept of "truth" — they have a concept of "what sounds right based on training data." Sometimes what sounds right is wrong.

$$ P(\text{next word}) = f(\text{preceding context}) $$

The model maximizes probability, not accuracy. "The capital of Australia is Sydney" has a high probability (many people make this mistake) even though it's wrong (it's Canberra).

### 2. Grounding: Connecting to Reality

**Grounding** means connecting the agent's responses to verifiable sources of truth. It's the primary defense against hallucination.

```
UNGROUNDED (Risky):
User: "What is our company's refund policy?"
Agent: "Your refund policy allows returns within 30 days."
(Made up! The agent doesn't actually know the policy)

GROUNDED (Safe):
User: "What is our company's refund policy?"
Agent: [Retrieves actual policy document via RAG]
Agent: "According to your refund policy document (section 3.2),
        returns are accepted within 14 days of purchase."
(Verified from actual source)
```

Grounding techniques:
- **RAG** (Week 6): Retrieve actual documents before answering
- **Tool use** (Week 4): Call APIs for real-time data instead of guessing
- **Citation**: Always reference where information came from
- **Fact-checking agent**: A second agent that verifies the first agent's claims

### 3. Guardrails: Safety Fences

**Guardrails** are rules and checks that prevent an agent from going off track. Think of them as the fences on a mountain road — they don't help you drive, but they stop you from falling off the cliff.

```
┌──────────────────────────────────────────────────┐
│                    GUARDRAILS                      │
│                                                    │
│  ┌────────────┐  ┌──────────┐  ┌──────────────┐ │
│  │   INPUT     │  │  PROCESS │  │   OUTPUT      │ │
│  │ Validation  │  │ Limits   │  │  Validation   │ │
│  │             │  │          │  │               │ │
│  │ • Block     │  │ • Max    │  │ • Check for   │ │
│  │   harmful   │  │   steps  │  │   harmful     │ │
│  │   prompts   │  │ • Time   │  │   content     │ │
│  │ • Validate  │  │   limits │  │ • Verify      │ │
│  │   format    │  │ • Cost   │  │   accuracy    │ │
│  │             │  │   caps   │  │ • Filter PII  │ │
│  └────────────┘  └──────────┘  └──────────────┘ │
└──────────────────────────────────────────────────┘
```

Types of guardrails:

| Guardrail | What it does | Example |
|-----------|-------------|---------|
| **Input validation** | Checks user input before processing | Block prompt injection attempts |
| **Output filtering** | Checks agent response before showing to user | Remove personal information from responses |
| **Step limits** | Prevents infinite loops | "Stop after 10 ReAct cycles" |
| **Cost caps** | Prevents runaway API costs | "Don't spend more than $1 on API calls per request" |
| **Topic boundaries** | Keeps agent focused on its domain | Medical agent refuses to give legal advice |
| **Confidence thresholds** | Only answer when sufficiently sure | "If confidence < 70%, say 'I'm not sure'" |

### 4. Fallback Strategies: Plan B, C, and D

When the primary approach fails, what does the agent do? Good agents have multiple fallback layers:

```
Attempt 1: Use primary tool (API call)
    │
    ├── Success → Return result
    │
    └── Failure → Attempt 2: Try alternative tool (web search)
                      │
                      ├── Success → Return result
                      │
                      └── Failure → Attempt 3: Use cached/default data
                                       │
                                       ├── Success → Return result (with disclaimer)
                                       │
                                       └── Failure → Honest failure message
                                                     "I couldn't find this information.
                                                      Here's what I tried and why it failed."
```

**The hierarchy of graceful failure**:
1. **Retry**: Try the same thing again (maybe it was a temporary glitch)
2. **Alternative**: Try a different approach to get the same result
3. **Partial answer**: Give what you can with a disclaimer
4. **Honest failure**: "I don't know" is always better than a wrong answer
5. **Escalation**: Hand off to a human or more capable system

### 5. Confidence Scoring: How Sure Is the Agent?

Not all answers are equally reliable. A good agent communicates its confidence:

| Confidence Level | What the agent should do | Example response |
|-----------------|------------------------|------------------|
| **High (90%+)** | Answer directly | "The capital of Pakistan is Islamabad." |
| **Medium (60-90%)** | Answer with caveats | "Based on the available data, the project seems on track, but I'd recommend verifying the latest numbers." |
| **Low (30-60%)** | Warn the user | "I'm not very confident about this. Here's my best guess, but please verify: ..." |
| **Very low (&lt;30%)** | Decline to answer | "I don't have enough information to answer this reliably. Could you provide more context?" |

How can an agent estimate confidence?
- **Source quality**: Is the answer from a verified document (high) or generated from memory (lower)?
- **Consistency**: If asked 5 times, does it give the same answer each time?
- **Retrieval score**: In RAG, how similar was the retrieved chunk to the question?
- **Self-evaluation**: Ask the model "How confident are you?" (surprisingly useful)

## How It Works: An Agent That Handles Errors Gracefully

**User asks**: *"What were the quarterly sales for our Karachi branch last month?"*

```
┌─ Agent Processing ──────────────────────────────────┐
│                                                       │
│ Thought: I need to look up sales data. Let me query  │
│          the sales database.                          │
│                                                       │
│ Action: query_database("SELECT sales FROM branches    │
│         WHERE branch='Karachi' AND month='last'")     │
│                                                       │
│ Observation: ERROR — Database connection timeout      │
│                                                       │
│ ┌─ GUARDRAIL: Error Recovery ─────────────────────┐  │
│ │ Primary method failed. Trying fallback...        │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ Thought: Database is down. Let me try the cached      │
│          report from the shared drive.                │
│                                                       │
│ Action: read_file("sales_reports/karachi_Q4.xlsx")    │
│                                                       │
│ Observation: File found. Last updated 3 days ago.     │
│              Total sales: 2.4M PKR                    │
│                                                       │
│ ┌─ GUARDRAIL: Staleness Check ────────────────────┐  │
│ │ Data is 3 days old. Flag this to the user.       │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ ┌─ GUARDRAIL: Confidence Assessment ──────────────┐  │
│ │ Source: Cached file (not live DB) — Medium conf.  │  │
│ │ Staleness: 3 days — Acceptable for monthly data  │  │
│ │ Overall confidence: 75%                           │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ Response: "Based on our most recent report (3 days    │
│ old), Karachi branch sales last month were 2.4M PKR.  │
│ Note: I couldn't access the live database, so this    │
│ is from a cached report. The live numbers may differ   │
│ slightly."                                            │
└───────────────────────────────────────────────────────┘
```

Notice: The agent didn't crash, didn't make up numbers, and was transparent about the limitation.

## Common Agent Failure Modes

Here are the most common ways agents fail, and how to handle each:

| Failure Mode | What happens | Prevention/Recovery |
|-------------|-------------|-------------------|
| **Infinite loop** | Agent keeps calling tools without making progress | Set maximum step limits (e.g., 10 ReAct cycles) |
| **Hallucinated tool calls** | Agent tries to use a tool that doesn't exist | Validate tool names against available tool list |
| **Context overflow** | Conversation exceeds token limit | Summarize old messages, use memory management (Week 8) |
| **Cascading failures** | One error causes a chain of errors | Isolate errors, don't pass broken data downstream |
| **Silent failures** | Agent ignores errors and continues with bad data | Always check tool return values for errors |
| **Overconfidence** | Agent presents uncertain information as fact | Require source citations, use confidence scoring |

## Real-World Applications

- **Self-driving cars**: Autonomous vehicles have multiple layers of error handling — sensor fusion (don't trust a single sensor), redundant systems (backup steering, backup brakes), and graceful degradation (slow down and pull over if systems fail).
- **Banking chatbots**: Financial AI assistants use strict guardrails — they can show your balance but can't transfer money without multi-factor authentication. If the system is unsure about a transaction, it asks for human confirmation.
- **Medical AI**: Diagnostic AI tools always present findings with confidence levels and explicitly state "this is not a diagnosis — consult a healthcare professional." They're designed to assist doctors, not replace them.
- **Content moderation**: Platforms like YouTube and Facebook use AI with confidence thresholds — high-confidence violations are auto-removed, medium-confidence ones are flagged for human review, and low-confidence ones are left alone.

## Try It Yourself

### Exercise 1: Spot the Hallucination
Ask an AI (ChatGPT or Gemini) these questions and check if the answers are correct:
1. "Who wrote the book 'The Last Train to Istanbul'?"
2. "What is the population of your city?" (check against actual data)
3. "Name 3 research papers about RAG published in 2023" (try to verify the papers exist)

Which answers were hallucinated? How could you tell?

### Exercise 2: Design Guardrails
You're building an AI assistant for a **school** that helps students with homework. Design guardrails for:
- What topics should the agent refuse to help with?
- What should happen if a student asks the agent to write their entire essay?
- How should the agent handle questions it's not confident about?
- What's the maximum number of steps the agent should take per question?

### Exercise 3: Write Error Recovery
Write a ReAct trace (from Week 5) where the agent encounters TWO errors and recovers from both:

Task: "Find the cheapest flight from Karachi to Dubai next Friday"
- Error 1: The flight search API is down
- Error 2: The alternative website returns results in a format the agent can't parse

How does the agent handle each error?

### Exercise 4: Confidence Calibration
Ask an AI the same factual question 5 times (start a new conversation each time). Questions to try:
- "How many districts are in Sindh province?"
- "What year was the first computer invented?"
- "What percentage of Earth's surface is water?"

Does it give the same answer each time? If the answers vary, the model's confidence should be lower.

## Key Takeaways

- **Hallucination** is when AI generates confident but incorrect information — it's the most dangerous type of error.
- **Grounding** connects AI responses to verifiable sources (RAG, APIs, documents) to prevent hallucination.
- **Guardrails** are safety checks on input, processing, and output that keep agents on track.
- **Fallback strategies** give agents Plan B, C, and D when the primary approach fails.
- **Confidence scoring** helps agents communicate how sure they are, so users know when to trust and when to verify.
- The best error message is always an **honest "I don't know"** rather than a fabricated answer.

## Quiz: Check Your Understanding

1. **What is hallucination in AI?**
   - a) When the AI sees things
   - b) When the AI generates confident but incorrect information
   - c) When the AI crashes
   - d) When the AI is too slow

2. **What is "grounding" in the context of AI agents?**
   - a) Connecting the AI to the electrical ground
   - b) Connecting responses to verifiable sources of truth
   - c) Teaching the AI about geography
   - d) Restarting the AI system

3. **What should an agent do when its primary tool fails?**
   - a) Crash and show an error message
   - b) Make up an answer based on what seems likely
   - c) Try fallback approaches, then honestly say it failed if nothing works
   - d) Ignore the error and continue

4. **What is a guardrail in AI systems?**
   - a) A physical safety fence
   - b) A validation rule that prevents the agent from going off track
   - c) A type of neural network layer
   - d) A programming language

5. **When should an agent say "I don't know"?**
   - a) Never — agents should always give an answer
   - b) When its confidence is too low to provide a reliable answer
   - c) Only when the user specifically asks
   - d) When it wants to seem humble

**Answers**: 1-b, 2-b, 3-c, 4-b, 5-b

---

*Next week: With great power comes great responsibility. We explore the ethics of giving AI agents autonomy.*
