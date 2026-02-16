---
sidebar_label: "Week 7: Planning"
sidebar_position: 7
title: "Week 7: Planning and Decomposition"
description: "Breaking big goals into manageable steps."
---

# Week 7: Planning and Decomposition

## Why This Matters

Nobody builds a house by saying "build a house" and starting randomly. You start with a plan: foundation first, then walls, then roof, then plumbing, then electrical, then painting. Each step depends on the previous one, and skipping steps leads to disaster.

AI agents face the same challenge. When you ask an agent to "plan my two-week vacation to Turkey," it can't do that in one step. It needs to **decompose** that big goal into smaller, manageable tasks — just like a project manager breaks down a project.

## Daily Life Use Case: Planning a Wedding

Planning a wedding is one of the most complex projects most people undertake. A good wedding planner breaks it down:

**Big Goal**: Plan a wedding for 200 guests in June

**Decomposed into sub-tasks**:
1. **Venue** (must be done first — everything depends on this)
   - Research venues → Visit top 3 → Book one → Pay deposit
2. **Catering** (depends on venue — need to know kitchen facilities)
   - Choose menu style → Get quotes → Taste testing → Finalize
3. **Guest List** (can happen in parallel with venue search)
   - Draft list → Get family input → Finalize → Send invitations
4. **Decorations** (depends on venue choice)
   - Choose theme → Hire decorator → Buy supplies
5. **Photography** (depends on date/venue)
   - Research photographers → Review portfolios → Book

Notice the **dependencies**: you can't book catering before you know the venue. You can't send invitations before you have a date. This is exactly how AI agents should plan.

## Core Concepts

### 1. Task Decomposition

**Task decomposition** is breaking a complex goal into smaller, actionable sub-tasks. Each sub-task should be:
- **Specific**: Clear enough to execute
- **Measurable**: You know when it's done
- **Independent** (where possible): Can be done without waiting for other tasks

| Big Goal | Decomposed Tasks |
|----------|-----------------|
| "Make dinner" | 1. Choose recipe → 2. Check ingredients → 3. Buy missing items → 4. Prep ingredients → 5. Cook → 6. Serve |
| "Write an essay" | 1. Choose topic → 2. Research → 3. Create outline → 4. Write draft → 5. Revise → 6. Proofread |
| "Move to a new city" | 1. Find job → 2. Find housing → 3. Pack belongings → 4. Hire movers → 5. Update address → 6. Set up utilities |

### 2. Goal Trees (Hierarchical Planning)

A **goal tree** shows tasks at multiple levels — from the big goal down to individual actions:

```
            Plan Birthday Party
           /        |          \
    Venue        Food         Guests
    /   \       /    \        /    \
 Search  Book  Menu  Order  List   Invite
   |            |              |
 Compare     Dietary         RSVP
 prices      needs           tracking
```

The top level is "what" you want. Each lower level answers "how" you'll achieve it. An agent works from top to bottom, expanding each task into sub-tasks until they're simple enough to execute.

### 3. Dependencies and Ordering

Not all tasks can happen in any order. **Dependencies** define what must happen before what:

```
Find venue ──→ Book venue ──→ Send invitations
                    │
                    ▼
              Order catering
```

Types of dependencies:
- **Sequential**: Task B can only start after Task A finishes (book venue → then send invites)
- **Parallel**: Tasks can happen at the same time (research venues AND draft guest list)
- **Conditional**: Task B only happens if Task A has a certain result (IF budget > 50,000 THEN hire photographer)

### 4. The Critical Path

The **critical path** is the longest chain of dependent tasks. It determines the minimum time to complete the entire project.

```
Research venues (3 days) → Visit venues (2 days) → Book (1 day)
                                                       → Order food (2 days) → Taste test (1 day)

Critical path: 3 + 2 + 1 + 2 + 1 = 9 days minimum
```

If any task on the critical path is delayed, the whole project is delayed. AI agents use this to prioritize which tasks to work on first.

### 5. Replanning: When Things Change

Good plans adapt. If the venue you wanted is booked, the agent should:
1. Recognize the failure
2. Update the plan (remove venue option, search for alternatives)
3. Assess impact on dependent tasks
4. Continue with the revised plan

This is called **replanning** — and it's what separates a good agent from a rigid script.

## How It Works: Agent Decomposes "Plan a Birthday Party"

**You ask**: *"Plan a surprise birthday party for my friend Ahmed. Budget is 15,000 PKR. He likes BBQ and cricket."*

**Agent's planning process**:

```
Step 1: Decompose the main goal

Goal: Surprise birthday party for Ahmed
├── Venue & Date
│   ├── Check Ahmed's schedule (avoid the surprise being ruined)
│   ├── Find BBQ-friendly venues within budget
│   └── Book venue
├── Food & Drinks
│   ├── BBQ menu planning (Ahmed likes BBQ)
│   ├── Order/buy supplies (meat, drinks, cake)
│   └── Arrange BBQ equipment
├── Entertainment
│   ├── Cricket-themed decorations
│   ├── Plan cricket-related game/activity
│   └── Arrange music/speaker
├── Guests
│   ├── Get guest list from mutual friends
│   ├── Send invitations (mark as SURPRISE)
│   └── Track RSVPs
└── Surprise Logistics
    ├── Plan how to get Ahmed to venue
    ├── Coordinate arrival times
    └── Assign someone to distract Ahmed

Step 2: Identify dependencies
- Must check Ahmed's schedule BEFORE setting date
- Must book venue BEFORE sending invitations
- Must know guest count BEFORE ordering food quantities

Step 3: Identify parallel tasks
- Can research venues AND draft guest list simultaneously
- Can plan entertainment AND order food simultaneously

Step 4: Estimate budget allocation
- Venue: ~3,000 PKR
- Food/BBQ: ~8,000 PKR
- Decorations: ~2,000 PKR
- Cake: ~2,000 PKR
- Total: 15,000 PKR ✓
```

## Real-World Applications

- **Project management AI**: Tools like Notion AI and Linear can auto-decompose feature requests into tasks, estimate timelines, and identify dependencies.
- **AI travel planners**: Decompose "plan a 2-week trip to Japan" into flights, hotels, daily itineraries, visa requirements, and budget planning.
- **Coding agents**: When asked to "add user authentication," the agent decomposes it into: design database schema → create user model → build registration endpoint → build login endpoint → add JWT tokens → write tests.
- **Study planners**: Decompose "prepare for final exams" into per-subject study plans with time allocation based on difficulty and exam dates.

## Try It Yourself

### Exercise 1: Decompose a Goal
Pick one of these goals and break it into a task tree with at least 3 levels:
1. "Organize a family Eid gathering"
2. "Start a small online business"
3. "Learn to drive a car"

### Exercise 2: Find the Dependencies
For your task tree from Exercise 1, draw arrows showing which tasks depend on which. Identify tasks that can happen in parallel.

### Exercise 3: Ask an AI to Plan
Give ChatGPT or Gemini a complex task and ask it to decompose it:

*"I want to organize a cricket tournament for 8 teams in my neighborhood. Decompose this into a detailed task tree with dependencies. Identify which tasks can happen in parallel and estimate a timeline."*

Compare the AI's plan to what you would have done.

### Exercise 4: Replanning
Take the plan from Exercise 3 and introduce a complication:
- "The park we wanted is unavailable"
- "Budget was cut by 50%"
- "Only 4 teams signed up instead of 8"

Ask the AI to replan. Does it handle the change gracefully?

## Key Takeaways

- **Task decomposition** breaks complex goals into specific, actionable sub-tasks.
- **Goal trees** organize tasks hierarchically from big goals to small actions.
- **Dependencies** determine task ordering — some tasks must wait for others; some can run in parallel.
- The **critical path** is the longest chain of dependent tasks and determines minimum completion time.
- Good agents can **replan** when circumstances change, adapting the plan instead of failing.

## Quiz: Check Your Understanding

1. **What is task decomposition?**
   - a) Deleting tasks you don't want to do
   - b) Breaking a complex goal into smaller, manageable sub-tasks
   - c) Combining small tasks into big ones
   - d) Prioritizing tasks by importance

2. **What is a goal tree?**
   - a) A tree diagram in a garden
   - b) A hierarchical breakdown of a goal into sub-goals and tasks
   - c) A list of goals for the year
   - d) A decision tree for choosing goals

3. **What does "dependency" mean in planning?**
   - a) Relying on someone for help
   - b) One task must be completed before another can start
   - c) Tasks that are very difficult
   - d) Tasks that cost money

4. **What is the "critical path"?**
   - a) The most important road to the venue
   - b) The longest chain of dependent tasks, determining minimum project time
   - c) The cheapest way to complete a project
   - d) The first task in the plan

5. **What should an agent do when a plan fails?**
   - a) Give up
   - b) Start over from scratch
   - c) Replan — adjust the plan based on what changed
   - d) Ignore the failure

**Answers**: 1-b, 2-b, 3-b, 4-b, 5-c

---

*Next week: How do agents remember things? From short-term context to long-term memory systems.*
