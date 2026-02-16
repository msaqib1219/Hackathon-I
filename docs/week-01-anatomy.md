---
sidebar_label: "Week 1: Anatomy"
sidebar_position: 1
title: "Week 1: The Anatomy of an Agent"
description: "What makes an AI 'Agentic'? Reasoning + Action + Observation."
---

# Week 1: The Anatomy of an Agent

## Why This Matters

Every day, you interact with software that follows fixed rules: press a button, get a result. Your calculator always adds the same way. Your alarm always rings at the set time. But what if software could *figure things out on its own*?

That's the shift from traditional software to **Agentic AI**. An AI agent doesn't just respond — it perceives the world, thinks about what to do, takes action, and learns from the result. Understanding this anatomy is the foundation for everything else in this course.

## Daily Life Use Case: Google Maps as an Agent

Think about the last time you used Google Maps for navigation. Here's what happened behind the scenes:

1. **Perception**: Maps detected your current location via GPS, observed real-time traffic data from millions of phones, and noted road closures reported by other users.
2. **Reasoning**: It analyzed multiple possible routes, estimated travel time for each, considered your preference (fastest vs. shortest), and decided on the best option.
3. **Action**: It displayed the route and started giving you turn-by-turn directions.
4. **Observation**: When you missed a turn, it *noticed* and immediately recalculated a new route.

This is exactly how an AI agent works — it's a loop of **Observe, Think, Act, Observe again**.

Compare this to a paper map (traditional software): it gives you fixed information, and if you take a wrong turn, you're on your own.

## Core Concepts

### 1. What is an Agent?

An agent is any system that can:
- **Perceive** its environment (receive inputs)
- **Reason** about what to do (make decisions)
- **Act** on those decisions (produce outputs or trigger actions)
- **Learn** from the results (adjust future behavior)

$$ Agent = Model + Tools + Environment $$

| Component | What it does | Example |
|-----------|-------------|---------|
| **Model** | The "brain" — processes information and makes decisions | GPT-4, Gemini, Claude |
| **Tools** | The "hands" — lets the agent interact with the world | Search engine, calculator, email sender |
| **Environment** | The "world" — everything the agent can perceive and affect | The internet, a database, a chat window |

### 2. Chatbot vs. Agent

Many people confuse chatbots with agents. Here's the key difference:

| Feature | Chatbot | Agent |
|---------|---------|-------|
| Responds to questions | Yes | Yes |
| Can use external tools | No | Yes |
| Can take actions in the world | No | Yes |
| Remembers across conversations | Sometimes | Yes |
| Can plan multi-step tasks | No | Yes |
| Works autonomously | No | Yes |

**A chatbot** is like a librarian who can answer your questions but can't leave the desk.

**An agent** is like a personal assistant who can answer questions, book your flights, send emails, check your calendar, and remind you to pack an umbrella because it checked the weather.

### 3. The Agent Loop

Every agent follows the same fundamental cycle:

```
┌──────────────┐
│   OBSERVE    │ ← Perceive the environment
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    THINK     │ ← Reason about what to do
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     ACT      │ ← Execute an action
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   OBSERVE    │ ← See the result, repeat
└──────────────┘
```

This loop continues until the agent achieves its goal or decides to stop.

### 4. Deterministic vs. Probabilistic

**Traditional software** is deterministic — the same input always produces the same output. `2 + 2` always equals `4`.

**AI agents** are probabilistic — the same question might get slightly different answers each time. Ask "Write me a poem about rain" twice, and you'll get two different poems. This is a feature, not a bug — it allows creativity and adaptability.

## How It Works: Building Blocks of an Agent

Let's trace through a real example. Suppose you ask an AI agent: *"What's the weather like in Karachi today? Should I carry an umbrella?"*

**Step 1 — Observe**: The agent receives your question as text input.

**Step 2 — Think**: The agent reasons: "I need current weather data for Karachi. I don't have that in my training data because it changes daily. I should use a weather tool."

**Step 3 — Act**: The agent calls a weather API tool:
```
Tool: get_weather
Input: { "city": "Karachi", "date": "today" }
Output: { "condition": "Partly cloudy", "rain_chance": "70%", "temp": "28°C" }
```

**Step 4 — Observe**: The agent reads the tool's response.

**Step 5 — Think**: "70% chance of rain is high. I should recommend an umbrella."

**Step 6 — Act**: The agent responds: *"It's 28°C and partly cloudy in Karachi today, but there's a 70% chance of rain. Definitely carry an umbrella!"*

Notice how the agent didn't just guess — it used a tool to get real data, then reasoned about that data to give you useful advice.

## Real-World Applications

You encounter AI agents every day, even if you don't realize it:

- **Email spam filters**: Observe incoming email → Reason about whether it's spam → Act by moving it to spam or inbox → Learn from your corrections when you mark something as "not spam"
- **Netflix recommendations**: Observe what you watch → Reason about your preferences → Act by suggesting new shows → Observe whether you click on them
- **Siri/Alexa/Google Assistant**: Observe your voice command → Reason about intent → Act by setting a timer, playing music, or answering a question → Observe if you say "that's wrong" and adjust
- **Uber's ride matching**: Observe rider location and driver availability → Reason about optimal matching → Act by assigning a driver → Observe ride completion and ratings

## Try It Yourself

### Exercise 1: Spot the Agents
Look around your daily life and identify **3 things** that behave like agents. For each one, write down:
- What does it **observe**?
- How does it **reason**?
- What **actions** does it take?
- How does it **learn** from results?

*Example*: A Roomba vacuum robot
- Observes: Room layout via sensors, dirt levels, battery status
- Reasons: Plans an efficient cleaning path, decides when to recharge
- Acts: Moves around, vacuums, returns to charging dock
- Learns: Maps your room over time, avoids places it gets stuck

### Exercise 2: Chatbot vs. Agent
Open any AI chatbot (ChatGPT, Gemini, etc.) and try these two tasks:

1. Ask: *"What is the capital of France?"* — The chatbot answers from its training data. No tools needed. This is chatbot behavior.
2. Ask: *"Search the web for today's top news headlines and summarize them."* — If the AI can actually search the web, it's acting as an agent. If it says "I can't browse the internet," it's just a chatbot.

### Exercise 3: Design Your Own Agent
Imagine you want to build an agent that helps you study for exams. Write down:
- What **tools** would it need? (e.g., access to your notes, a quiz generator, a timer)
- What would the **agent loop** look like for a study session?
- How would it know when to **stop**?

## Key Takeaways

- An **agent** is not just an AI model — it's a system that combines a model with tools and an environment.
- Agents follow a loop: **Observe → Think → Act → Observe**.
- The difference between a chatbot and an agent is the ability to **use tools and take actions**.
- Traditional software is deterministic (fixed rules); agents are probabilistic (flexible, adaptive).
- You already interact with agents daily — spam filters, navigation apps, voice assistants, and recommendation systems.

## Quiz: Check Your Understanding

1. **What are the three components of an AI agent?**
   - a) Input, Processing, Output
   - b) Model, Tools, Environment
   - c) Code, Data, Server
   - d) Brain, Memory, Skills

2. **What is the main difference between a chatbot and an agent?**
   - a) Agents are faster
   - b) Chatbots are smarter
   - c) Agents can use tools and take actions in the world
   - d) There is no difference

3. **Which of these is NOT part of the agent loop?**
   - a) Observe
   - b) Think
   - c) Compile
   - d) Act

4. **Why is Google Maps considered an "agent"?**
   - a) It shows a map
   - b) It perceives traffic, reasons about routes, acts by navigating, and adapts when you deviate
   - c) It was made by Google
   - d) It uses the internet

5. **What does "probabilistic" mean in the context of AI agents?**
   - a) The agent always gives the same answer
   - b) The agent might give slightly different responses to the same input
   - c) The agent uses probability formulas
   - d) The agent is unreliable

**Answers**: 1-b, 2-c, 3-c, 4-b, 5-b

---

*Next week: We'll explore how the way you talk to an agent dramatically changes what it can do — the art of structured input and prompt engineering.*
