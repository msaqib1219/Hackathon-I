---
sidebar_label: "Week 9: Orchestration"
sidebar_position: 9
title: "Week 9: Multi-Agent Orchestration"
description: "When one agent isn't enough: building teams of AI."
---

# Week 9: Multi-Agent Orchestration

## Why This Matters

A single doctor can't run a hospital. You need surgeons, nurses, pharmacists, radiologists, and administrators — each specialized, each communicating with the others. Similarly, a single AI agent has limits. **Multi-agent orchestration** is about building teams of specialized AI agents that collaborate to solve complex problems.

## Daily Life Use Case: A Hospital Team

When you visit a hospital for a broken arm:

1. **Reception agent** (Triage): Checks you in, assesses urgency, assigns you to the right department
2. **Doctor agent** (Specialist): Examines your arm, orders an X-ray, decides on treatment
3. **Radiology agent**: Takes and reads the X-ray, sends results back to the doctor
4. **Pharmacist agent**: Prepares prescribed medications based on the doctor's orders
5. **Billing agent**: Calculates costs, processes insurance

Each person is **specialized** — the pharmacist doesn't do surgery, and the surgeon doesn't handle billing. But they all share information through a **common system** (patient records). This is exactly how multi-agent AI systems work.

## Core Concepts

### 1. Why Multiple Agents?

Single agents hit limitations:

| Limitation | Why it happens | Multi-agent solution |
|-----------|---------------|---------------------|
| **Context overflow** | One task needs too much information | Split knowledge across specialized agents |
| **Skill mismatch** | One agent can't be expert at everything | Create specialists (coder, writer, researcher) |
| **Speed** | Complex tasks take too long sequentially | Parallel agents work simultaneously |
| **Reliability** | One agent might make mistakes | Another agent checks the work |

### 2. Agent Roles and Specialization

In a multi-agent system, each agent has a specific role:

```
┌─────────────────────────────────────────┐
│           CONTENT CREATION TEAM          │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │Researcher│  │  Writer  │  │ Editor ││
│  │          │  │          │  │        ││
│  │ Finds    │  │ Drafts   │  │Reviews ││
│  │ facts    │──→│ content  │──→│& fixes ││
│  │ & data   │  │          │  │        ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

Each agent has:
- A **system prompt** defining its role and expertise
- Access to specific **tools** relevant to its job
- **Communication channels** to other agents

### 3. Orchestration Patterns

#### Pattern 1: Coordinator (Manager-Worker)

One "manager" agent delegates tasks to "worker" agents:

```
         ┌────────────┐
         │ Coordinator │
         │  (Manager)  │
         └──┬───┬───┬──┘
            │   │   │
     ┌──────┘   │   └──────┐
     ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Worker 1 │ │ Worker 2 │ │ Worker 3 │
│(Research)│ │(Writing) │ │(Code)    │
└─────────┘ └─────────┘ └─────────┘
```

The coordinator decides which worker handles which task, collects results, and assembles the final output.

#### Pattern 2: Pipeline (Assembly Line)

Agents work in sequence, each adding to the previous one's output:

```
Input → [Agent A: Draft] → [Agent B: Review] → [Agent C: Format] → Output
```

Like a factory assembly line — each station adds value.

#### Pattern 3: Swarm (Collaborative)

Multiple agents work on the same problem simultaneously and share findings:

```
     ┌─────────┐
     │ Agent A  │──┐
     └─────────┘  │
     ┌─────────┐  │    ┌──────────────┐
     │ Agent B  │──├───→│  Shared Pool  │
     └─────────┘  │    │  of Results   │
     ┌─────────┐  │    └──────────────┘
     │ Agent C  │──┘
     └─────────┘
```

#### Pattern 4: Handoff (Escalation)

Agents pass the conversation to the next agent when they reach their limits:

```
Customer → [Tier 1: FAQ Bot] ──can't help──→ [Tier 2: Specialist] ──still stuck──→ [Tier 3: Human]
```

### 4. Message Passing

Agents communicate by passing **messages** — structured information about what they've done and what they need:

```
From: Researcher Agent
To: Writer Agent
Message: {
  "task": "Write article about RAG",
  "research_findings": [
    "RAG was introduced by Facebook AI in 2020",
    "It combines retrieval with generation",
    "Used by 78% of enterprise AI applications"
  ],
  "tone": "beginner-friendly",
  "word_count": 500
}
```

### 5. Conflict Resolution

What happens when agents disagree? For example, a safety agent says "don't publish" but a content agent says "it's ready."

Strategies:
- **Hierarchy**: The manager agent makes the final call
- **Voting**: Multiple agents vote and majority wins
- **Human-in-the-loop**: Escalate to a human for the final decision
- **Priority rules**: Safety always overrides content

## How It Works: Customer Support Multi-Agent System

**Customer writes**: *"I ordered a laptop 2 weeks ago and it hasn't arrived. I want a refund."*

```
┌─ Triage Agent ─────────────────────────────────────┐
│ Thought: This involves order tracking AND refund.   │
│ Action: Route to Order Specialist first.            │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─ Order Specialist Agent ───────────────────────────┐
│ Action: lookup_order(customer_id="C1234")           │
│ Result: Order #5678, shipped 12 days ago,           │
│         tracking shows "stuck in transit"           │
│                                                     │
│ Thought: Order is delayed, not lost. Let me check   │
│          the carrier for updates.                   │
│ Action: check_carrier("TCS", tracking="TR9876")     │
│ Result: Package at Karachi hub, delivery expected    │
│         within 2 days.                              │
│                                                     │
│ Message to Triage: "Order delayed, not lost.        │
│  Expected delivery in 2 days. Customer may still    │
│  want refund — handing off to Refund Agent."        │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─ Refund Agent ─────────────────────────────────────┐
│ Retrieved context from Order Specialist.            │
│                                                     │
│ Thought: Package is delayed but arriving in 2 days. │
│ I should offer options rather than immediate refund. │
│                                                     │
│ Response to customer:                               │
│ "I found your order — it's at the Karachi hub and   │
│  should arrive within 2 days. Would you like to:    │
│  1. Wait for delivery (2 days)                      │
│  2. Get a full refund and cancel the order          │
│  3. Get a partial discount for the delay"           │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─ Quality Check Agent ──────────────────────────────┐
│ Reviews the response before sending.                │
│ Check: Polite? ✓ Accurate? ✓ Options given? ✓      │
│ Approved for sending.                               │
└─────────────────────────────────────────────────────┘
```

Four agents, each with a clear role, working together seamlessly.

## Real-World Applications

- **AI customer support** (Intercom, Zendesk): Triage bots route tickets to specialized agents — billing, technical, returns — with human escalation for complex cases.
- **Content creation pipelines**: Research agent finds data → Writer agent drafts content → Editor agent reviews → SEO agent optimizes. Used by marketing teams.
- **Software development AI**: Product manager agent writes specs → Developer agent writes code → Tester agent runs tests → Reviewer agent checks code quality.
- **Autonomous vehicles**: Perception agent (sees the road) → Planning agent (decides the route) → Control agent (steers the car) → Safety agent (emergency braking).

## Try It Yourself

### Exercise 1: Design a Multi-Agent System
Design a 3-agent system for **planning a group vacation** for 5 friends. Define:
- Each agent's role and expertise
- What tools each agent has access to
- How they communicate (what messages they pass)
- The orchestration pattern (coordinator, pipeline, or swarm)

### Exercise 2: Identify Agent Teams
Think of 3 real-world services you use and identify the "agent team" behind them:
- Example: Food delivery app → Order agent, Restaurant agent, Driver agent, Payment agent

### Exercise 3: Conflict Scenario
Two agents disagree:
- Agent A (Budget): "This hotel is cheapest at $50/night"
- Agent B (Quality): "This hotel has terrible reviews. Recommend the $80/night one instead"

How should the coordinator resolve this? Write out the decision logic.

### Exercise 4: Pipeline Design
Design a pipeline (assembly line) of agents for creating a YouTube video:
- What does each agent do?
- What does each agent pass to the next?
- Where could things go wrong?

## Key Takeaways

- **Multi-agent systems** use specialized agents working together, like a team of experts.
- Common patterns: **Coordinator** (manager delegates), **Pipeline** (assembly line), **Swarm** (parallel collaboration), **Handoff** (escalation).
- Agents communicate through **structured messages** containing tasks, context, and results.
- **Conflict resolution** strategies include hierarchy, voting, and human escalation.
- Multi-agent systems are used in customer support, content creation, software development, and autonomous vehicles.

## Quiz: Check Your Understanding

1. **Why use multiple agents instead of one?**
   - a) Multiple agents are always cheaper
   - b) Specialized agents handle their domains better than one generalist agent
   - c) It's more fun
   - d) Single agents don't work at all

2. **What is the "Coordinator" pattern?**
   - a) All agents work independently
   - b) One manager agent delegates tasks to specialist worker agents
   - c) Agents take turns
   - d) A human coordinates all agents

3. **How do agents communicate in a multi-agent system?**
   - a) They share the same context window
   - b) Through structured messages containing tasks, context, and results
   - c) They read each other's minds
   - d) Through email

4. **What is a "handoff" in agent orchestration?**
   - a) Agents shaking hands
   - b) Passing a conversation from one agent to another when the first can't help
   - c) Shutting down an agent
   - d) Creating a new agent

5. **What should happen when two agents disagree?**
   - a) The system crashes
   - b) Both outputs are shown to the user
   - c) A resolution strategy (hierarchy, voting, or human decision) determines the outcome
   - d) The first agent always wins

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-c

---

*Next week: What happens when agents make mistakes? We tackle error handling and hallucination management.*
