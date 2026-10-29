import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { ApiError, asyncRoute, parseInput } from './errors.js';

const messageSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() }))
  })).max(20).default([])
});

const SYSTEM_PROMPT = `You are IntelliBot, an expert AI assistant embedded inside "Interview Intelligence" (IntelliGrid) — a student interview preparation platform for campus placements and off-campus tech recruitment.

Your role is to help students:
- Prepare for technical interviews at companies like Amazon, Google, Microsoft, Meta, Flipkart, Paytm, etc.
- Understand DSA topics: Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, Greedy, Backtracking, etc.
- Learn System Design concepts: scalability, load balancing, databases, caching, message queues
- Understand OS concepts: processes, threads, deadlocks, memory management
- Understand DBMS: normalization, SQL queries, indexing, transactions
- OOP design principles: SOLID, design patterns
- Behavioral/HR interview tips and STAR method responses
- LeetCode problem-solving strategies
- Resume building and campus placement tips specific to Indian universities

Keep answers concise, structured (bullet points), encouraging, and focused on practical interview prep.`;

let genAI = null;

function hasValidApiKey() {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== 'YOUR_GEMINI_API_KEY_HERE' && key.trim().length > 10);
}

function getGenAI() {
  if (!genAI && hasValidApiKey()) {
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    } catch {
      genAI = null;
    }
  }
  return genAI;
}

// Built-in intelligent response generator for interview prep when Gemini key is not configured
function generateIntelligentResponse(userQuery) {
  const q = userQuery.toLowerCase();

  if (q.includes('star') || q.includes('behavioral') || q.includes('hr')) {
    return `### ⭐ The STAR Method for Behavioral & HR Rounds

The STAR framework is the standard for answering situational questions (especially at **Amazon**, **Google**, and **Microsoft**):

1. **S - Situation (15%)**: Set the context. Describe the project, company, or challenge.
   *Example: "During my 6th-semester capstone project, our team had 48 hours before the deployment deadline when..."*
2. **T - Task (15%)**: What was your specific responsibility? What goal were you trying to achieve?
   *Example: "My task was to optimize the backend API latency which had spiked to 3.2 seconds under simulated load."*
3. **A - Action (50%)**: The most important part! What specific steps did **you** take?
   *Example: "I profiled our SQL queries using EXPLAIN ANALYZE, discovered missing composite indexes, and implemented a Redis caching layer for top 10% read queries."*
4. **R - Result (20%)**: Quantifiable impact and key learnings.
   *Example: "Latency dropped from 3.2s to 120ms (96% reduction), and our system handled 1,500 concurrent requests without failure."*

💡 **Pro Tip**: Always focus on "**I** did", not just "we did", to highlight your personal contribution!`;
  }

  if (q.includes('amazon') || q.includes('sde') || q.includes('leadership')) {
    return `### 📦 Cracking Amazon SDE-1 (Full Guide)

Amazon evaluates candidates on two equal pillars: **Algorithmic Problem Solving** and the **16 Leadership Principles (LPs)**.

#### 1. Technical Rounds Structure
- **Round 1 (OA)**: 2 coding questions (usually Trees/Graphs/DP) + Work Simulation.
- **Rounds 2-4 (Virtual Technical)**: 45-60 min each. Every round begins with **15-20 min of LP probing** followed by 1-2 coding problems.

#### 2. Top Amazon DSA Focus
- **Graphs & Trees**: BFS/DFS, Topological Sort (e.g. *Course Schedule*), LCA of Binary Tree.
- **Two Pointers & Sliding Window**: *Subarray Sum Equals K*, *Longest Substring Without Repeating Characters*.
- **Heaps & Priority Queues**: *Top K Frequent Elements*, *Merge K Sorted Lists*.
- **Design/LLD**: *LRU Cache* (highest reported Amazon question!).

#### 3. Top Amazon LPs to Prepare
1. **Customer Obsession**
2. **Ownership**
3. **Bias for Action**
4. **Deliver Results**

Prepare at least **2 STAR stories** for each of these principles!`;
  }

  if (q.includes('google') || q.includes('googleyness')) {
    return `### 🔍 Cracking Google Software Engineer (SWE)

Google has one of the most algorithmic-heavy interviews in Big Tech.

#### Key Focus Areas:
1. **Hard Graphs & DP**: Shortest path algorithms (Dijkstra, Bellman-Ford), Segment Trees, Trie, and Multi-dimensional DP.
2. **Code Cleanliness**: You will write code in Google Docs / Chromebook environment with **no syntax highlighting or autocompletion**.
3. **Edge Case Coverage**: Before coding, explicitly clarify constraints:
   - What happens with empty inputs, negative numbers, overflow?
   - What is the expected time and space complexity?

#### Top Google Problems:
- *Median of Two Sorted Arrays*
- *Trapping Rain Water*
- *Alien Dictionary*
- *Shortest Path in a Grid with Obstacles Elimination*`;
  }

  if (q.includes('dp') || q.includes('dynamic programming')) {
    return `### ⚡ Dynamic Programming — Core Strategy

Dynamic Programming (DP) boils down to two properties: **Overlapping Subproblems** and **Optimal Substructure**.

#### 3-Step Framework to Solve Any DP Problem:
1. **Define the State**: What variables uniquely identify a subproblem? (e.g., \`dp[i][j]\` = max profit using first \`i\` items with weight \`j\`).
2. **Formulate the Recurrence Relation**: How does \`dp[i]\` depend on smaller subproblems like \`dp[i-1]\` or \`dp[i-2]\`?
3. **Base Cases & Direction**: What is the smallest known answer? (e.g., \`dp[0] = 0\`). Compute iteratively or memoize top-down.

#### Top Patterns to Master:
- **0/1 Knapsack**: Subset Sum, Partition Equal Subset.
- **Longest Common Subsequence (LCS)**: Edit Distance, Longest Palindromic Substring.
- **Matrix / Grid Pathfinding**: Unique Paths, Minimum Path Sum.
- **1D Jump/Robber**: Climbing Stairs, House Robber I & II.`;
  }

  if (q.includes('system design') || q.includes('lld') || q.includes('hld')) {
    return `### 🏗️ System Design Interview Primer

For campus placements & SDE-1, focus mainly on **Low-Level Design (LLD / OOD)** and fundamental **High-Level Design (HLD)** principles.

#### 1. Core Architectural Concepts
- **Load Balancing**: Round Robin, Least Connections, Consistent Hashing.
- **Caching**: Write-through vs Write-back, Cache Invalidation, Redis/Memcached.
- **Databases**: SQL (ACID, relational) vs NoSQL (horizontal scaling, eventual consistency).
- **CAP Theorem**: Consistency vs Availability under network Partitions.

#### 2. High-Frequency LLD Problems
- Design a **Parking Lot** System (using OOP Design Patterns: Strategy, Factory, Observer).
- Design an **LRU Cache** (HashMap + Doubly Linked List).
- Design a **Rate Limiter** (Token Bucket or Leaky Bucket algorithm).
- Design a **URL Shortener** (Base62 encoding + collision handling).`;
  }

  if (q.includes('os') || q.includes('operating system') || q.includes('deadlock') || q.includes('thread')) {
    return `### 💻 Operating Systems (Core CS Fundamentals)

Top questions asked in Microsoft, Flipkart, and Amazon technical rounds:

1. **Process vs Thread**:
   - A *process* has its own independent address space (heavyweight).
   - A *thread* shares code, data, and heap with peer threads in the same process, but has its own stack and registers (lightweight).
2. **Deadlock Conditions (Coffman Conditions)**:
   - Mutual Exclusion
   - Hold and Wait
   - No Preemption
   - Circular Wait
3. **Virtual Memory & Paging**:
   - Page Faults, TLB (Translation Lookaside Buffer), Page Replacement Algorithms (LRU, FIFO).
4. **Synchronization Primitives**:
   - Mutex (locking) vs Semaphore (signaling/counting).`;
  }

  if (q.includes('dbms') || q.includes('sql') || q.includes('database')) {
    return `### 🗄️ DBMS & SQL Essentials for Placement Drives

1. **ACID Properties**:
   - **Atomicity**: All or nothing transaction.
   - **Consistency**: Database invariants are preserved.
   - **Isolation**: Concurrent transactions do not interfere (Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
   - **Durability**: Committed data survives system crashes.
2. **Indexing (B+ Trees)**:
   - Why B+ Trees? Shallow height, high fan-out, sequential leaf traversal for range queries.
3. **Normalization**:
   - 1NF (atomic values) → 2NF (no partial dependency) → 3NF (no transitive dependency) → BCNF.
4. **Must-Know SQL Queries**:
   - N-th highest salary using \`DENSE_RANK()\` or \`LIMIT/OFFSET\`.
   - \`INNER JOIN\` vs \`LEFT JOIN\` vs \`FULL OUTER JOIN\`.`;
  }

  // General fallback response
  return `### 🎯 IntelliBot Placement Advice: "${userQuery}"

Here are the key takeaways and actionable preparation steps:

1. **Algorithmic Foundation**:
   - Master the Top 75 LeetCode patterns (Arrays, Two Pointers, Trees, Graphs, DP).
   - Spend 20 minutes attempting independently before checking hints.
2. **Mock Interview Practice**:
   - Practice vocalizing your thought process aloud as you code.
   - Use our **Mock Interviews** tab to simulate 1-on-1 rounds with verified peer mentors.
3. **Company-Specific Intel**:
   - Check the **Company Prep** tab to view historical round structures and verified student debriefs for your target company.

💬 *Ask me about specific companies (Amazon, Google, Microsoft), DSA topics, STAR method, or System Design anytime!*`;
}

export function aiChatRouter() {
  const router = Router();

  // Return status: always active (powered by Gemini if key exists, or built-in engine)
  router.get('/ai/status', (req, res) => {
    const hasKey = hasValidApiKey();
    res.json({
      data: {
        enabled: true,
        mode: hasKey ? 'gemini' : 'built-in',
        hasGeminiKey: hasKey
      }
    });
  });

  router.post('/ai/chat', asyncRoute(async (req, res) => {
    const { message, history } = parseInput(messageSchema, req.body);

    const client = getGenAI();

    // 1. If Gemini API key is configured, use real Gemini 1.5 Flash API
    if (client) {
      try {
        const model = client.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_PROMPT
        });

        const chat = model.startChat({
          history: history.length > 0 ? history : [],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return res.json({
          data: {
            reply: text,
            provider: 'gemini',
            newHistoryEntry: {
              role: 'model',
              parts: [{ text }]
            }
          }
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to built-in advisor:', geminiError?.message);
        // Fall through to built-in knowledge response
      }
    }

    // 2. Intelligent built-in knowledge engine (always available, no API key required)
    const reply = generateIntelligentResponse(message);

    res.json({
      data: {
        reply,
        provider: 'built-in',
        newHistoryEntry: {
          role: 'model',
          parts: [{ text: reply }]
        }
      }
    });
  }));

  return router;
}
