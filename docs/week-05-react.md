---
sidebar_label: "Week 5: ReAct"
sidebar_position: 5
title: "Week 5: The ReAct Framework"
description: "Synergizing Reasoning and Acting in a powerful loop."
---

# Week 5: The ReAct Framework

## Why This Matters

In Week 3, we taught AI to **think** step by step. In Week 4, we gave it **tools** to act in the world. But thinking without acting is daydreaming, and acting without thinking is reckless. The **ReAct framework** combines both into a powerful loop: Think → Act → Observe → Think again.

This is how the most capable AI agents in the world work today — from AI research assistants to autonomous coding agents.

## Daily Life Use Case: Online Shopping

Think about how you buy something online. You don't just click "buy" on the first thing you see. You follow a natural loop:

1. **Think**: "I need new running shoes under 10,000 PKR"
2. **Act**: Search on Daraz for "running shoes"
3. **Observe**: 500 results. Too many. Most are too expensive.
4. **Think**: "Let me filter by price and check ratings"
5. **Act**: Apply filters: price under 10,000, rating 4+ stars
6. **Observe**: 12 results. The Nike ones look good but have mixed reviews.
7. **Think**: "Let me read the reviews more carefully"
8. **Act**: Click on the Nike shoes and read the top 5 reviews
9. **Observe**: 3 reviews mention the sole wears out quickly.
10. **Think**: "Not worth it. The Adidas pair has better reviews at a similar price."
11. **Act**: Add Adidas shoes to cart and purchase.

This **Think → Act → Observe** loop is exactly the ReAct pattern. You naturally do this dozens of times a day.

## Core Concepts

### 1. The ReAct Loop

ReAct stands for **Re**asoning + **Act**ing. It's a structured loop:

```
┌──────────────────────────────────────────────────┐
│                                                    │
│   ┌──────────┐    ┌──────────┐    ┌────────────┐ │
│   │ THOUGHT  │ ──→│  ACTION  │ ──→│OBSERVATION │ │
│   │ (Reason) │    │ (Do)     │    │ (See)      │ │
│   └──────────┘    └──────────┘    └─────┬──────┘ │
│        ▲                                 │        │
│        └─────────────────────────────────┘        │
│                                                    │
│              Repeat until goal is met              │
└──────────────────────────────────────────────────┘
```

Each step has a specific role:
- **Thought**: The agent reasons about what it knows and what it needs to do next
- **Action**: The agent uses a tool (search, calculate, send message, etc.)
- **Observation**: The agent reads the result of the action

### 2. ReAct Traces

A **trace** is the written log of every thought, action, and observation. Reading traces is like reading the agent's diary — you can see exactly *why* it made each decision.

Here's a real ReAct trace for answering: *"Who is the president of the country that won the most gold medals at the 2024 Olympics?"*

```
Thought 1: I need to find which country won the most gold medals
           at the 2024 Olympics. I'll search for this.

Action 1:  search_web("2024 Olympics most gold medals country")

Observation 1: The United States won the most gold medals (40)
               at the 2024 Paris Olympics.

Thought 2: Now I need to find who is the president of the
           United States.

Action 2:  search_web("president of United States 2024")

Observation 2: The president of the United States is Joe Biden
               (as of 2024).

Thought 3: I now have all the information I need. The country
           with the most golds was the USA, and their president
           was Joe Biden.

Action 3:  finish("The president is Joe Biden. The United States
           won the most gold medals (40) at the 2024 Paris
           Olympics.")
```

Notice how the agent:
- Broke a complex question into sub-questions
- Used tools to find each piece of information
- Combined the results into a final answer

### 3. Why Not Just "Think and Answer"?

Without the Act step, AI can only reason about what it already knows. This leads to:

| Approach | Result |
|----------|--------|
| **Reasoning only** (no tools) | "I think France won the most golds?" (hallucination) |
| **Acting only** (no reasoning) | Searches randomly, gets overwhelmed by results |
| **ReAct** (reasoning + acting) | Systematically finds the right answer with evidence |

$$ \text{Accuracy}_{ReAct} >> \text{Accuracy}_{reasoning\ alone} >> \text{Accuracy}_{acting\ alone} $$

### 4. Knowing When to Stop

A critical part of ReAct is knowing **when the goal is met**. Without a stopping condition, the agent would loop forever. An agent should stop when:

- It has enough information to answer the question
- It has completed the requested action
- It has tried multiple approaches and none worked (fail gracefully)
- It has hit a maximum number of steps (safety limit)

### 5. Error Recovery in ReAct

What happens when an action fails? Good agents handle errors gracefully:

```
Thought: I need to check the flight status.
Action: check_flight("PK301")
Observation: ERROR — API returned "Service unavailable"

Thought: The flight status API is down. Let me try the airline
         website instead.
Action: search_web("PIA flight PK301 status today")
Observation: Found status on FlightAware: PK301 is on time,
            departing at 14:30.

Thought: I found the information through an alternative source.
```

The agent didn't crash — it **adapted** and found another way.

## How It Works: Full ReAct Trace

Let's trace through a complete example. You ask: *"Find me a good Pakistani restaurant near Gulshan-e-Iqbal, Karachi that's open right now and has good biryani reviews."*

```
Thought 1: I need to find Pakistani restaurants near
           Gulshan-e-Iqbal. Let me search for them first.

Action 1:  search_restaurants({
             "location": "Gulshan-e-Iqbal, Karachi",
             "cuisine": "Pakistani",
             "status": "open_now"
           })

Observation 1: Found 8 restaurants:
  1. Student Biryani (4.1 stars, 500m away)
  2. Kolachi Restaurant (4.5 stars, 2km away)
  3. BBQ Tonight (4.3 stars, 1.5km away)
  ...

Thought 2: I have a list, but I need to check which ones
           have good biryani specifically. Let me check
           reviews for the top-rated ones.

Action 2:  get_reviews({
             "restaurant": "Student Biryani",
             "filter": "biryani"
           })

Observation 2: Reviews mentioning biryani:
  - "Best biryani in the area!" (5 stars)
  - "Biryani is flavorful but portions are small" (3 stars)
  - "Their chicken biryani is a must-try" (5 stars)
  Average biryani rating: 4.3/5

Thought 3: Student Biryani has good biryani reviews (4.3/5)
           and is closest. Let me also check Kolachi since
           it has the highest overall rating.

Action 3:  get_reviews({
             "restaurant": "Kolachi Restaurant",
             "filter": "biryani"
           })

Observation 3: Only 2 reviews mention biryani.
  - "Biryani was average, but seafood is amazing" (3 stars)
  Average biryani rating: 3.0/5

Thought 4: Student Biryani has much better biryani reviews
           (4.3 vs 3.0) and is closer. I'll recommend that.

Action 4:  finish("I recommend Student Biryani in
           Gulshan-e-Iqbal! It's just 500m away, open now,
           and has excellent biryani reviews (4.3/5).
           Customers love their chicken biryani especially.")
```

## Real-World Applications

- **AI research assistants**: Tools like Perplexity AI use ReAct to search the web, read articles, and synthesize answers with citations.
- **AI travel planners**: Search flights → Check prices → Find hotels → Build itinerary, all in a ReAct loop.
- **Coding agents** (like Claude Code, Cursor): Read code → Think about what to change → Edit files → Run tests → Fix errors if tests fail.
- **Customer support AI**: Identify issue → Look up account → Check knowledge base → Attempt resolution → Escalate if needed.

## Try It Yourself

### Exercise 1: Write a ReAct Trace
Write a complete ReAct trace (Thought → Action → Observation) for this task:

*"I want to send a birthday message to my friend Ahmed. Find out what day his birthday is (check contacts), compose a nice message, and send it via WhatsApp."*

Include at least 3 Thought-Action-Observation cycles.

### Exercise 2: Spot the Loop
Watch yourself complete a daily task (cooking a meal, researching a purchase, planning an outing) and write down each Think-Act-Observe step you take. You'll be surprised how naturally you follow the ReAct pattern!

### Exercise 3: Error Recovery
Write a ReAct trace where something goes wrong. For example:
- You ask the agent to book a restaurant, but the restaurant is fully booked
- You ask the agent to find a YouTube video, but the first search returns irrelevant results

How does the agent adapt?

### Exercise 4: Compare Approaches
Ask an AI this question with and without the ReAct framing:

**Without ReAct**: *"What's the best-selling book in Pakistan right now?"*

**With ReAct framing**: *"I want to know the best-selling book in Pakistan right now. Think step by step: first consider what tool you'd need, then describe what you'd search for, then what you'd do with the results."*

Compare the quality of responses.

## Key Takeaways

- **ReAct** combines reasoning and acting in a loop: **Think → Act → Observe → Repeat**.
- **Traces** let you see exactly why an agent made each decision — making the agent debuggable and trustworthy.
- Reasoning without acting leads to **hallucination**; acting without reasoning leads to **random behavior**. ReAct prevents both.
- Good agents know **when to stop** — when the goal is met, when they've failed, or when they hit a safety limit.
- **Error recovery** is built into the loop — if an action fails, the agent can think of an alternative.

## Quiz: Check Your Understanding

1. **What does ReAct stand for?**
   - a) Real Action
   - b) Reasoning + Acting
   - c) Reactive Agent
   - d) Response Action

2. **What are the three steps in a ReAct loop?**
   - a) Input, Process, Output
   - b) Thought, Action, Observation
   - c) Plan, Execute, Review
   - d) Start, Run, Stop

3. **What happens if an agent only reasons without acting?**
   - a) It becomes faster
   - b) It may hallucinate because it can't verify information
   - c) It becomes more accurate
   - d) Nothing changes

4. **What is a ReAct "trace"?**
   - a) A bug in the system
   - b) A log of every thought, action, and observation the agent made
   - c) A type of network connection
   - d) The agent's training data

5. **Why is error recovery important in ReAct?**
   - a) It isn't important
   - b) Because tools can fail, and the agent needs to adapt rather than crash
   - c) Because errors make the agent faster
   - d) Because users always make mistakes

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-b

---

*Next week: What happens when the agent needs to answer questions using information that isn't in its training data? Enter RAG — Retrieval Augmented Generation.*
