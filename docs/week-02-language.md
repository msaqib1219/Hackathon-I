---
sidebar_label: "Week 2: Language"
sidebar_position: 2
title: "Week 2: The Power of Language (Structured Input)"
description: "How the way you talk to AI changes everything."
---

# Week 2: The Power of Language (Structured Input)

## Why This Matters

Imagine walking into a restaurant and saying "Give me food." You'd get something, but probably not what you wanted. Now imagine saying: "I'd like a medium-rare steak with mashed potatoes, no gravy, and a glass of water." Same restaurant, dramatically different result.

This is exactly how AI works. The **quality of your input determines the quality of your output**. This week, we learn how to speak to AI agents effectively — a skill called **prompt engineering**.

## Daily Life Use Case: Ordering Food via a Voice Assistant

You say to your voice assistant: *"Order pizza."*

The assistant has to guess everything: What size? What toppings? From where? Delivery or pickup? It might ask you 5 follow-up questions, or worse, just order something random.

Now imagine you say: *"Order a large pepperoni pizza with extra cheese from Domino's for delivery to my home address, paying with my saved card."*

One sentence. No follow-up questions. Perfect result. You just did **prompt engineering** in your daily life.

## Core Concepts

### 1. What is a Prompt?

A prompt is any input you give to an AI model. It could be:
- A question: *"What is photosynthesis?"*
- An instruction: *"Translate this to Urdu."*
- A conversation: *"You are a helpful tutor. Explain gravity to a 10-year-old."*

The prompt is the **steering wheel** of AI. The model is the engine — powerful but directionless without your input.

### 2. Tokens: How AI Reads Your Words

AI doesn't read words the way you do. It breaks text into **tokens** — small pieces that might be words, parts of words, or even single characters.

| Your Text | Tokens |
|-----------|--------|
| "Hello" | `["Hello"]` (1 token) |
| "unhappiness" | `["un", "happiness"]` (2 tokens) |
| "ChatGPT is great" | `["Chat", "GPT", " is", " great"]` (4 tokens) |

**Why does this matter?**
- AI models have a **token limit** (called the context window). GPT-4 can handle ~128,000 tokens. Gemini can handle up to 1 million.
- More tokens = more cost (if using paid APIs)
- Being concise saves tokens and often improves results

### 3. The Context Window

Think of the context window as the AI's **short-term memory**. It's like a desk — you can only fit so many papers on it at once. Everything in the context window (your prompt, the conversation history, any documents you paste) must fit within the token limit.

```
┌─────────────────────────────────────────────┐
│              CONTEXT WINDOW                  │
│                                              │
│  System instructions    ████░░░░░░░░░░░░░░  │
│  Conversation history   ████████░░░░░░░░░░  │
│  Your current message   ██░░░░░░░░░░░░░░░░  │
│  AI's response space    ░░░░░░░░░░░░░░░░░░  │
│                                              │
│  ████ = Used    ░░░░ = Available             │
└─────────────────────────────────────────────┘
```

If you fill the window with too much history, there's less room for the AI's response.

### 4. Prompt Engineering: The Art of Asking

Prompt engineering is the skill of crafting inputs that produce the best outputs. Here are the key techniques:

#### Technique 1: Be Specific

| Bad Prompt | Good Prompt |
|-----------|-------------|
| "Write about climate change" | "Write a 200-word summary of climate change causes, suitable for a high school student" |
| "Help me with code" | "Write a Python function that takes a list of numbers and returns the average" |
| "Tell me about Pakistan" | "List the 5 largest cities in Pakistan by population, with their approximate population" |

#### Technique 2: Give Context (Role Assignment)

Tell the AI **who it should be**:

- *"You are a patient math tutor for a 12-year-old. Explain fractions using pizza slices as an example."*
- *"You are a senior software engineer reviewing code. Point out bugs and suggest fixes."*
- *"You are a nutritionist. Create a 7-day meal plan for someone trying to lose weight, budget-friendly, Pakistani cuisine."*

#### Technique 3: Provide Examples (Few-Shot)

Show the AI what you want by giving examples:

```
Convert these sentences to formal English:

Input: "gonna head out now"
Output: "I will be leaving now."

Input: "can't make it tmrw"
Output: "I will not be able to attend tomorrow."

Input: "thx for the help bro"
Output:
```

The AI will follow your pattern and produce: *"Thank you for your assistance."*

#### Technique 4: Specify the Format

Tell the AI exactly how to structure its response:

*"List 5 benefits of exercise. For each benefit, provide:
- A one-line summary
- A brief scientific explanation
- A practical tip for beginners
Format as a numbered list."*

### 5. System Prompts vs. User Prompts

Most AI systems have two types of prompts:

| Type | Who writes it | Purpose | Example |
|------|--------------|---------|---------|
| **System prompt** | The developer | Sets the AI's personality, rules, and boundaries | "You are a helpful study assistant. Never give answers directly — guide the student to find the answer." |
| **User prompt** | The end user | The actual question or task | "How do I solve this quadratic equation?" |

When you use ChatGPT, there's a hidden system prompt you never see. When you build your own agent, *you* write the system prompt.

## How It Works: From Words to AI Response

Here's what happens when you type a message to an AI:

**Step 1 — Tokenization**: Your text is broken into tokens.

**Step 2 — Encoding**: Each token is converted into a number (an embedding — more on this in Week 6).

**Step 3 — Processing**: The model processes all tokens together, considering how each word relates to every other word (this is called "attention").

**Step 4 — Generation**: The model predicts the next token, one at a time, based on probability.

**Step 5 — Decoding**: Tokens are converted back into human-readable text.

$$ P(\text{next token}) = f(\text{all previous tokens}) $$

This is why your prompt matters so much — every word you include changes the probability of what comes next.

## Real-World Applications

- **Customer support chatbots**: Companies write system prompts that say "Be polite, only answer questions about our products, and escalate to a human if you can't help." This is prompt engineering at scale.
- **Gmail Smart Compose**: When Gmail suggests how to finish your sentence, it's using your partially typed text as a prompt.
- **Code Copilot**: GitHub Copilot uses your code comments and existing code as a "prompt" to suggest the next lines.
- **AI-generated social media captions**: Tools like Canva use prompts like "Write a fun, engaging Instagram caption for a photo of a sunset at the beach" behind the scenes.

## Try It Yourself

### Exercise 1: The Prompt Makeover
Take these vague prompts and rewrite them to be specific, contextual, and well-formatted:

1. *"Write an essay about technology"*
2. *"Help me eat healthy"*
3. *"Explain AI"*

Try both the vague and improved versions in ChatGPT/Gemini and compare the results.

### Exercise 2: Role Play
Ask an AI the same question with different roles:

- *"You are a 5-year-old. Explain what the internet is."*
- *"You are a network engineer. Explain what the internet is."*
- *"You are a poet. Explain what the internet is."*

Notice how the role completely changes the response.

### Exercise 3: Few-Shot Magic
Create a few-shot prompt that teaches the AI to:
- Convert Pakistani city names to their province
- Translate formal English to casual Urdu
- Or any other pattern you find useful

Give 2-3 examples, then ask for a new one.

### Exercise 4: Token Counter
Go to any free token counter tool and paste different texts. Observe:
- How many tokens is a paragraph?
- Is Urdu text more or fewer tokens than English?
- What happens to the token count when you use abbreviations?

## Key Takeaways

- **Your prompt is the most important input to any AI system.** Better prompts = better results.
- AI reads text as **tokens**, not words. Token limits define how much the AI can "remember" at once.
- The **context window** is the AI's working memory — everything must fit inside it.
- Key prompt techniques: **Be specific**, **assign a role**, **give examples** (few-shot), and **specify format**.
- **System prompts** (set by developers) and **user prompts** (from users) work together to shape AI behavior.

## Quiz: Check Your Understanding

1. **What is a token in AI?**
   - a) A type of cryptocurrency
   - b) A small piece of text that AI uses to process language
   - c) A password
   - d) A type of computer memory

2. **What is the context window?**
   - a) A browser window showing context
   - b) The maximum amount of text an AI can process at once
   - c) A window in an office
   - d) The AI's permanent memory

3. **Which prompt will likely give a better result?**
   - a) "Write something about food"
   - b) "Write a 150-word blog post about the health benefits of Pakistani cuisine, targeting health-conscious millennials"
   - c) Both are equally good
   - d) Neither will work

4. **What is few-shot prompting?**
   - a) Asking the AI a few times
   - b) Giving the AI examples of what you want before asking for new output
   - c) Using short prompts
   - d) Shooting few photos with AI

5. **Why does the quality of your prompt matter?**
   - a) Better prompts cost less money
   - b) Every word in your prompt changes the probability of what the AI generates next
   - c) AI only works with good grammar
   - d) It doesn't actually matter

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-b

---

*Next week: We'll explore how AI agents reason through problems step by step — and why "think before you act" applies to AI too.*
