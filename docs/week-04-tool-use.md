---
sidebar_label: "Week 4: Tool Use"
sidebar_position: 4
title: "Week 4: Tool Use (Function Calling)"
description: "Giving AI agents hands to interact with the real world."
---

# Week 4: Tool Use (Function Calling)

## Why This Matters

Imagine the smartest person you know — a genius who can answer any question about history, science, and literature. But they're locked in a room with no phone, no internet, and no way to contact the outside world. They can tell you what the weather *usually* is in Karachi in February, but they can't tell you what it is *right now*.

That's what an AI model is without tools — incredibly knowledgeable but completely isolated. **Function calling** gives AI agents "hands" to reach out into the real world: checking the weather, sending emails, searching databases, and more.

## Daily Life Use Case: Smart Home Assistants

When you say *"Alexa, turn off the bedroom lights,"* here's what actually happens:

1. **Alexa hears your voice** and converts it to text: "turn off the bedroom lights"
2. **The AI understands your intent**: You want to control a light. Which one? Bedroom. What action? Turn off.
3. **Alexa calls a function**: It doesn't "magically" control the lights — it calls the smart bulb's API:
   ```
   Function: control_light
   Input: { "room": "bedroom", "action": "off" }
   ```
4. **The light turns off** and Alexa confirms: "Okay, bedroom lights are off."

Every smart home command is a **function call**. The AI is the brain; the function is the hand that flips the switch.

## Core Concepts

### 1. What is Function Calling?

Function calling is the ability of an AI model to:
1. **Recognize** that it needs an external tool to answer a question
2. **Choose** the right tool from a list of available tools
3. **Generate** the correct input parameters for that tool
4. **Use the result** to formulate its response

Think of it like a person at a desk with different phones. Each phone connects to a different service. The person decides which phone to pick up and what to say.

### 2. Tools = Functions with Descriptions

For an AI to use a tool, it needs a **description** of what the tool does, what inputs it needs, and what output it returns. This is like giving someone a menu of services:

| Tool Name | Description | Required Inputs | Output |
|-----------|------------|-----------------|--------|
| `get_weather` | Get current weather for a city | city (text) | temperature, condition, humidity |
| `send_email` | Send an email to someone | to, subject, body | success/failure |
| `search_web` | Search the internet | query (text) | list of results |
| `calculate` | Perform math calculations | expression (text) | result (number) |

The AI reads these descriptions and decides which tool to use based on your question.

### 3. The Tool Use Flow

Here's the complete flow when an AI uses a tool:

```
You: "What's the weather in Lahore?"
         │
         ▼
┌─────────────────────────┐
│ AI reads your question   │
│ and available tools      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ AI decides: "I need the  │
│ get_weather tool"        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ AI generates parameters: │
│ { "city": "Lahore" }    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ System executes the tool │
│ and returns results      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ AI reads the results and │
│ writes a natural response│
└─────────────────────────┘
         │
         ▼
AI: "It's 32°C and sunny in Lahore right now!"
```

**Key insight**: The AI doesn't execute the tool itself — it generates a *request* to use the tool, and the system (your code) actually runs it. This is a safety feature.

### 4. When to Use Tools vs. Knowledge

The AI must decide: *"Can I answer this from what I know, or do I need a tool?"*

| Question | Tool needed? | Why? |
|----------|-------------|------|
| "What is the capital of France?" | No | Static fact in training data |
| "What's the weather in Paris right now?" | Yes | Real-time data needed |
| "What's 15% of 847?" | Maybe | AI can do simple math, but a calculator is more reliable |
| "Send an email to my boss" | Yes | Requires action in the real world |
| "What were yesterday's headlines?" | Yes | Recent data not in training data |

### 5. Input/Output Schemas

Tools need precise inputs. When you tell a friend "Book me a flight," they'll ask: "Where to? When? How many people?" Tools are the same — they need a **schema** (a structured format):

```
Tool: book_flight
Input Schema:
  - origin: string (required) - departure city
  - destination: string (required) - arrival city
  - date: string (required) - format YYYY-MM-DD
  - passengers: number (optional, default 1)

Output Schema:
  - confirmation_id: string
  - flight_number: string
  - departure_time: string
  - price: number
```

The AI's job is to extract these parameters from your natural language and format them correctly.

## How It Works: A Complete Tool Use Example

**You ask**: *"I'm planning a trip to Istanbul next month. What's the weather usually like, and can you find me a cheap hotel?"*

**Step 1 — AI reasons**: "This requires two tools: weather lookup and hotel search. I'll call them one at a time."

**Step 2 — First tool call**:
```
Tool: get_weather_forecast
Input: { "city": "Istanbul", "month": "March" }
Output: { "avg_temp": "12°C", "condition": "Mild, some rain", "rain_days": 10 }
```

**Step 3 — Second tool call**:
```
Tool: search_hotels
Input: { "city": "Istanbul", "check_in": "2026-03-15", "check_out": "2026-03-20", "sort_by": "price" }
Output: [
  { "name": "Cozy Inn", "price": "$45/night", "rating": 4.2 },
  { "name": "Budget Stay", "price": "$38/night", "rating": 3.8 }
]
```

**Step 4 — AI combines results**: *"Istanbul in March is mild (around 12°C) with some rainy days — pack a light jacket and umbrella! For hotels, I found Budget Stay at $38/night (3.8 stars) and Cozy Inn at $45/night (4.2 stars). I'd recommend Cozy Inn for the better reviews."*

Notice how the AI used **two tools**, combined the results, and added its own reasoning ("I'd recommend...").

## Real-World Applications

- **Voice assistants (Siri, Alexa, Google)**: Every command — "set a timer," "play music," "call Mom" — is a function call to a specific service.
- **Banking chatbots**: "Check my balance" calls `get_account_balance(account_id)`. "Transfer $500" calls `transfer_money(from, to, amount)`.
- **AI coding assistants**: GitHub Copilot and similar tools call functions like `search_codebase`, `run_tests`, `read_file` to help developers.
- **Customer support bots**: "Where's my order?" triggers a `track_order(order_id)` function call that checks the shipping database.

## Try It Yourself

### Exercise 1: Design a Tool Card
Create a "tool card" for one of these tools, including name, description, required inputs, optional inputs, and expected output:

1. A tool that translates text between languages
2. A tool that checks if a website is currently online
3. A tool that converts currency amounts

Example format:
```
Tool Name: translate_text
Description: Translates text from one language to another
Inputs:
  - text (required): The text to translate
  - source_language (optional): Language of input (auto-detect if not provided)
  - target_language (required): Language to translate to
Output:
  - translated_text: The translation
  - detected_language: What language was detected
```

### Exercise 2: Spot the Function Calls
Think about your phone usage yesterday. List every interaction that was likely a **function call** behind the scenes:
- Opened a map? → `get_directions(origin, destination)`
- Sent a message? → `send_message(recipient, text)`
- Checked social media? → `get_feed(user_id, count)`

Try to identify at least 5.

### Exercise 3: When Would You Use a Tool?
For each question, decide: **Can the AI answer from knowledge, or does it need a tool?**

1. "Who wrote Romeo and Juliet?"
2. "What time is it in Tokyo right now?"
3. "How many calories are in a banana?"
4. "Is my favorite store open right now?"
5. "What's the square root of 144?"

### Exercise 4: Multi-Tool Scenario
Describe a scenario where an AI agent would need to use **3 or more tools** in sequence. Write out what each tool call would look like.

Example: *"Plan my evening"* might need: check_calendar → get_weather → search_restaurants → book_table

## Key Takeaways

- **Function calling** gives AI agents the ability to interact with the real world — checking data, sending messages, controlling devices.
- Tools need clear **descriptions and schemas** so the AI knows when and how to use them.
- The AI doesn't execute tools directly — it **requests** tool use, and the system runs them (a safety feature).
- The AI must decide whether to use **knowledge or tools** based on whether the information is static or dynamic.
- **Multiple tools** can be chained together to handle complex, multi-step tasks.

## Quiz: Check Your Understanding

1. **What is function calling in the context of AI agents?**
   - a) The AI writing code
   - b) The AI generating structured requests to use external tools
   - c) Calling someone on the phone
   - d) A programming language feature

2. **Why does an AI need a "tool description"?**
   - a) For documentation purposes only
   - b) So the AI knows what the tool does, what inputs it needs, and what output to expect
   - c) To make the tool run faster
   - d) It doesn't need one

3. **When should an AI use a tool instead of its own knowledge?**
   - a) Always
   - b) Never
   - c) When it needs real-time data, needs to take an action, or needs guaranteed accuracy (like math)
   - d) Only when the user asks for it

4. **Who actually executes the tool when an AI makes a function call?**
   - a) The AI model itself
   - b) The system/code that hosts the AI (not the AI itself)
   - c) The user
   - d) The internet

5. **Which of these is NOT a function call?**
   - a) "Alexa, set a timer for 5 minutes"
   - b) "Tell me a joke" (from training data)
   - c) "Check my bank balance"
   - d) "Send an email to John"

**Answers**: 1-b, 2-b, 3-c, 4-b, 5-b

---

*Next week: We combine reasoning (Week 3) with tool use (Week 4) into the powerful ReAct framework — where agents think, act, and learn in a continuous loop.*
