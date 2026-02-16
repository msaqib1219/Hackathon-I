---
sidebar_label: "Week 3: Reasoning"
sidebar_position: 3
title: "Week 3: Reasoning Patterns"
description: "Teaching AI to think before it speaks."
---

# Week 3: Reasoning Patterns

## Why This Matters

Have you ever given someone directions and they immediately got lost, but when you said "Let me walk you through it step by step," they got it right? AI works the same way.

By default, AI models try to answer in one leap. But when we teach them to **think step by step**, their accuracy improves dramatically — sometimes from 30% to over 90% on math and logic problems. This week, we learn the reasoning patterns that make AI agents genuinely intelligent.

## Daily Life Use Case: A Doctor Diagnosing an Illness

When you visit a doctor with a headache, a good doctor doesn't immediately say "It's a migraine." Instead, they:

1. **Gather symptoms**: "Where does it hurt? How long? Any nausea? Vision changes?"
2. **Consider possibilities**: "This could be a tension headache, migraine, sinusitis, or something more serious."
3. **Narrow down**: "No nausea or vision issues rules out migraine. The location and timing suggest tension headache."
4. **Conclude**: "This appears to be a tension headache. Let's try these remedies."

This is **Chain of Thought reasoning** — and it's exactly what we want AI agents to do instead of jumping to conclusions.

## Core Concepts

### 1. Chain of Thought (CoT)

Chain of Thought prompting means asking the AI to **show its reasoning** before giving an answer. It's the difference between:

**Without CoT:**
> *Question: A shop has 15 apples. It sells 7 in the morning and gets a delivery of 12 in the afternoon. How many apples does it have?*
> *Answer: 18*

Wait, is that right? Without seeing the work, you can't tell. Let's try again:

**With CoT:**
> *Question: A shop has 15 apples. It sells 7 in the morning and gets a delivery of 12 in the afternoon. How many apples does it have? **Think step by step.***
>
> *Step 1: Start with 15 apples.*
> *Step 2: Sell 7 in the morning: 15 - 7 = 8 apples.*
> *Step 3: Receive 12 in afternoon: 8 + 12 = 20 apples.*
> *Answer: 20 apples*

The magic words are often just: **"Think step by step"** or **"Let's work through this carefully."**

### 2. Zero-Shot vs. Few-Shot Reasoning

| Approach | What it means | When to use it |
|----------|--------------|----------------|
| **Zero-shot** | Ask the AI to reason without any examples | Simple tasks, when you trust the model |
| **Few-shot** | Show the AI examples of good reasoning, then ask your question | Complex or unusual tasks |

**Zero-shot example:**
> *"Is 17 a prime number? Think step by step."*

The AI figures out the reasoning pattern on its own.

**Few-shot example:**
> *"Is 7 a prime number?*
> *Step 1: Check if 7 is divisible by 2. 7/2 = 3.5. No.*
> *Step 2: Check if 7 is divisible by 3. 7/3 = 2.33. No.*
> *Step 3: We only need to check up to sqrt(7) ≈ 2.6. We've checked 2 and 3.*
> *Conclusion: 7 is prime.*
>
> *Is 15 a prime number?*
> *Step 1: Check if 15 is divisible by 2. 15/2 = 7.5. No.*
> *Step 2: Check if 15 is divisible by 3. 15/3 = 5. Yes!*
> *Conclusion: 15 is not prime (15 = 3 x 5).*
>
> *Now: Is 23 a prime number?"*

By showing examples, you've taught the AI your exact reasoning format.

### 3. Self-Consistency

Sometimes one chain of thought leads to a wrong answer. **Self-consistency** means asking the AI to reason through the problem **multiple times using different approaches** and then picking the most common answer.

Think of it like asking 5 different friends to solve the same math problem independently. If 4 of them get "20" and 1 gets "18," you trust "20."

```
Approach 1: Start → Sell → Deliver → 20 apples
Approach 2: Delivery first? No, morning before afternoon → 20
Approach 3: Total changes: -7 + 12 = +5. Start 15 + 5 = 20
```

All three approaches agree: **20 apples**. High confidence.

### 4. Tree of Thoughts

While Chain of Thought is a single path of reasoning, **Tree of Thoughts** explores multiple branches:

```
         "Should I take an umbrella?"
              /          \
     Check weather      Check bag space
         /    \              |
     Rainy   Sunny     Bag is full
       |       |            |
    Yes!     No          Compact umbrella?
                           /      \
                         Yes       No
                          |         |
                     Take it    Skip it
```

This is how you naturally make decisions — you consider multiple factors and their implications. Advanced AI agents use this pattern for complex planning.

### 5. Reasoning + Acting = ReAct (Preview)

A sneak peek at Week 5: when reasoning is combined with action, you get the **ReAct** pattern. The agent doesn't just think — it thinks, acts, observes, and thinks again.

## How It Works: Why Does "Think Step by Step" Actually Work?

Remember from Week 2 that AI generates text token by token, where each new token depends on all previous tokens:

$$ P(\text{next token}) = f(\text{all previous tokens}) $$

When you ask for step-by-step reasoning, each intermediate step becomes part of the "previous tokens." This means:

- **Step 1's output** helps the model generate **Step 2** more accurately
- **Step 2's output** helps generate **Step 3** more accurately
- And so on...

Without intermediate steps, the model has to make a **giant leap** from question to answer. With CoT, it makes many **small, accurate leaps**.

It's like the difference between:
- Jumping across a 10-meter gap (likely to fall) vs.
- Walking across 10 stepping stones, 1 meter apart (easy!)

## Real-World Applications

- **AI math tutors** (like Khan Academy's Khanmigo): Use CoT to walk students through solutions step by step, not just give answers.
- **Medical AI diagnosis**: Systems like those used in radiology reason through findings systematically — "I see X, which could mean A or B. Feature Y rules out A. Conclusion: B."
- **Legal AI assistants**: Analyze contracts clause by clause, reasoning about implications rather than giving a yes/no answer.
- **Customer support bots**: Reason through troubleshooting steps: "Is the device on? → Is it connected to WiFi? → Have you tried restarting?" instead of randomly suggesting fixes.

## Try It Yourself

### Exercise 1: The CoT Difference
Ask ChatGPT or Gemini this question **twice** — once normally, once with "Think step by step":

*"A farmer has 23 sheep. All but 7 die. How many sheep does the farmer have left?"*

(This is a trick question! Compare how the AI handles it with and without CoT.)

### Exercise 2: Build a Few-Shot Reasoner
Create a few-shot prompt that teaches the AI to determine if a business idea is good. Provide 2 examples with step-by-step reasoning, then ask about a new idea:

Example format:
```
Business idea: A food delivery app for pets
Step 1: Is there a market? Pet owners spend billions per year...
Step 2: Is there competition? ...
Step 3: Is it technically feasible? ...
Verdict: ...

Now evaluate: "An AI-powered app that helps students find
study partners at their university"
```

### Exercise 3: Self-Consistency Test
Ask an AI the same tricky logic problem 3 times in **separate conversations** and see if you get consistent answers:

*"If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?"*

Compare the answers. Did CoT help with consistency?

### Exercise 4: Daily Decision Tree
Pick a real decision you're facing (what to eat for lunch, which route to take to work, which phone to buy) and:
1. Draw a simple Tree of Thoughts with 2-3 branches
2. Evaluate each branch
3. Pick the best option

Then ask an AI to make the same decision and compare approaches.

## Key Takeaways

- **"Think step by step"** is one of the most powerful techniques in AI — it can dramatically improve accuracy.
- **Chain of Thought (CoT)** makes AI show its work, leading to better and more verifiable answers.
- **Zero-shot** reasoning uses no examples; **few-shot** provides examples of good reasoning patterns.
- **Self-consistency** runs multiple reasoning chains and picks the majority answer.
- **Tree of Thoughts** explores multiple reasoning branches simultaneously for complex decisions.
- CoT works because each intermediate step provides context for the next step, turning one big leap into many small ones.

## Quiz: Check Your Understanding

1. **What is Chain of Thought (CoT) prompting?**
   - a) Chaining multiple AI models together
   - b) Asking the AI to show its step-by-step reasoning
   - c) A type of blockchain for AI
   - d) Writing very long prompts

2. **What simple phrase can dramatically improve AI reasoning?**
   - a) "Be smart"
   - b) "Think step by step"
   - c) "Try harder"
   - d) "Use maximum power"

3. **What is the difference between zero-shot and few-shot?**
   - a) Zero-shot is faster
   - b) Few-shot provides examples; zero-shot doesn't
   - c) Zero-shot is more accurate
   - d) They are the same thing

4. **Why does Chain of Thought actually improve AI performance?**
   - a) It makes the AI think faster
   - b) Each reasoning step provides context for the next step, making each prediction easier
   - c) It uses more electricity
   - d) It accesses a special reasoning database

5. **A farmer has 23 sheep. All but 7 die. How many are left?**
   - a) 16
   - b) 23
   - c) 7
   - d) 0

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-c

---

*Next week: We give our agents hands! Learn how AI agents use tools and function calling to interact with the real world.*
