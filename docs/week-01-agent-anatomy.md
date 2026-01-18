# Week 01: Agent Anatomy

## Why Agent Anatomy?

Before building agents, understand their core components: reasoner (LLM), tools, memory, planner. This foundational knowledge prevents common pitfalls like brittle prompts or hallucinated actions.

Systems view: Agent as cybernetic system with sensors (tools), brain (LLM), effectors (actions).

## How to Dissect an Agent

1. **Reasoner**: LLM core – generates thoughts.
2. **Short-term memory**: Conversation history.
3. **Long-term memory**: Vector store for recall.

Math: Agent loop iterations \\( t = 1 \\to T \\): \\( a_t = \\pi (s_t) \\).

**Phase overview**: Agent anatomy connects to tool use (Week 4) via action interfaces and memory (Week 8) for persistence. See cross-links in sidebar.
