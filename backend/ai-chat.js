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

const SYSTEM_PROMPT = `You are IntelliBot, a friendly and expert AI assistant embedded inside "Interview Intelligence" (IntelliGrid 2.0).
Help students with:
- Navigating the website (Company Prep, Mock Interviews, Expert Chat, Dashboard)
- Technical interview preparation (DSA, System Design, OS, DBMS, OOP)
- Company recruitment rounds (Amazon, Google, Microsoft, Meta, etc.)
- Behavioral interviews using the STAR method
- Resume tips and placement guidance

Keep answers conversational, clear, helpful, and concise with Markdown formatting.`;

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

// Built-in intelligent conversational response engine
function generateIntelligentResponse(userQuery) {
  const raw = userQuery.trim();
  const q = raw.toLowerCase();

  // 1. Natural Greetings & Friendly Opening
  if (/^(hi|hello|hey|hey\s+chat|hi\s+bot|sup|howdy|good\s+morning|good\s+evening|good\s+afternoon|yo)[\s!.,?]*$/i.test(q) || q === 'hi chat' || q === 'hello chat') {
    return `Hey there! 👋 I'm **IntelliBot**, your AI placement assistant on **Interview Intelligence**.

How can I help you today? Here are a few things you can ask me:
- 🏢 **Company Intelligence**: *"How does the Amazon or Google interview loop work?"*
- ⭐ **Behavioral Tips**: *"Explain the STAR method for behavioral rounds"*
- 💡 **DSA & System Design**: *"Top topics for Amazon"*, *"Explain Dynamic Programming"*, or *"Design YouTube"*
- 🌐 **Platform Guide**: *"How do I book a mock interview?"* or *"Where is my dashboard?"*

What are you preparing for?`;
  }

  // 2. Identity / "Who are you?"
  if (q.includes('who are you') || q.includes('what is your name') || q.includes('what can you do') || q.includes('what is this bot')) {
    return `I am **IntelliBot** 🤖, your 24/7 AI interview preparation assistant!

I'm embedded right here inside **Interview Intelligence** (IntelliGrid 2.0) to help you:
1. Understand recruitment processes and topic weightages across 650+ tech companies.
2. Crack technical DSA and System Design interview questions.
3. Perfect your behavioral STAR answers for HR and managerial rounds.
4. Navigate this platform smoothly (mock interviews, dashboard tracking, experience sharing).

Feel free to ask me any question!`;
  }

  // 3. Conversational Polite Fillers
  if (/^(thanks|thank you|thx|ty|awesome|great|cool|perfect|ok|okay|got it|nice|bye|goodbye)[\s!.,?]*$/i.test(q)) {
    return `You're very welcome! 😊 Feel free to ask anytime if you want to practice problems, learn an algorithm, or prepare for an interview. Best of luck with your placement prep! 🚀`;
  }

  // 4. Website Guide & Navigation Questions
  if (q.includes('how to use') || q.includes('about website') || q.includes('what is this website') || q.includes('how does this work') || q.includes('platform')) {
    return `### 🌐 Navigating Interview Intelligence (IntelliGrid 2.0)

Our platform has **3 core pillars** to prepare you for campus and off-campus placements:

1. **🏢 Company Prep** (Top Navbar):
   - **Company Directory**: Browse 650+ tech companies with difficulty ratings and recruitment focus.
   - **Interview Intelligence**: View predictive topic weightages (% DSA vs System Design vs Core CS) and loop rounds.
   - **Experiences Feed**: Read verified, round-by-round logs submitted by students who cleared placements.
   - **Question Bank**: High-frequency LeetCode problems reported by students.
   - **Share Experience**: Submit your own interview rounds to help juniors!

2. **🤝 Mock Interviews**:
   - Browse verified peer mentors from Amazon, Google, Microsoft, and book a 1-on-1 strategy call or mock interview.

3. **💬 Expert Chat**:
   - Direct text advisory with domain specialists.

4. **📊 Target Dashboard**:
   - Track your consistency heatmap, campus milestones, and practice table (automatically saved in MongoDB!).`;
  }

  // How to book a mock interview
  if (q.includes('mock interview') || q.includes('book call') || q.includes('book mock') || q.includes('book session')) {
    return `### 🤝 How to Book a Mock Interview:

1. Click on **Mock Interviews** in the top navigation bar.
2. Under the **Find Mentors** tab, browse verified candidates who cleared Google, Amazon, Microsoft, and Tier-1 product firms.
3. Click **Book Mock Session** on any mentor card.
4. Select your preferred date & time slot and add optional preparation notes.
5. Once booked, your session will appear on your **Dashboard** and under **My Bookings** with an instant link to enter the simulated mock video room!`;
  }

  // How to share an experience
  if (q.includes('share experience') || q.includes('submit experience') || q.includes('add experience')) {
    return `### ✍️ How to Share Your Interview Experience:

1. Click the cyan **+ Share Experience** button in the top navbar (or navigate to **Company Prep > Share Experience**).
2. Enter the Company Name, Role, Drive Type (On-Campus vs Off-Campus), and Result.
3. Add your round-by-round breakdown (OA, Technical Round 1, System Design, HR/Behavioral).
4. Share tips for junior students and click **Submit Experience**.
5. Your experience is securely stored in MongoDB and sent for placement verification!`;
  }

  // Dashboard / Bookmarks help
  if (q.includes('dashboard') || q.includes('milestone') || q.includes('progress') || q.includes('track')) {
    return `### 📊 Using Your Target Dashboard:

Your Dashboard (**http://localhost:5173/dashboard**) is synced with MongoDB in real-time:
- **Target Track**: Click between **Amazon SDE**, **Google SWE**, or **Microsoft SWE** to switch target readiness metrics.
- **Recruitment Milestones**: Click any milestone pill (e.g. *Amazon OA Simulation*) to toggle its status (\`Completed\` / \`In Progress\` / \`Todo\`).
- **52-Week Heatmap**: Automatically increments whenever you solve challenges in the Practice Table!
- **Saved Bookmarks**: View your saved companies, questions, and experiences in one place.
- **Academic Info**: Click **Edit Profile** next to your name to set your College & Graduation Year.`;
  }

  // 5. Behavioral / STAR Method
  if (q.includes('star') || q.includes('behavioral') || q.includes('hr round') || q.includes('hr question')) {
    return `### ⭐ The STAR Method Framework (Behavioral & HR Rounds)

The STAR method is mandatory for behavioral interviews (especially **Amazon Leadership Principles**, **Googleyness**, and **Microsoft Values**):

1. **S - Situation (15%)**: Set the background. Where were you working? What was the context?
   *Example: "In my 6th-semester team project, our server crashed during high-traffic load testing 2 days before the presentation."*

2. **T - Task (15%)**: What was your specific goal or challenge?
   *Example: "My task was to diagnose the database bottleneck and stabilize API latency."*

3. **A - Action (50%)**: The meat of the answer! What specific actions did **you** take?
   *Example: "I profiled our SQL queries, added missing composite indexes, and implemented a Redis caching layer for read-heavy endpoints."*

4. **R - Result (20%)**: Quantifiable impact and key learnings.
   *Example: "Latency dropped from 2.8s to 95ms (96% improvement) and the system handled 2,000 concurrent users without errors."*

💡 **Golden Rule**: Always highlight what **you** did, not just the team!`;
  }

  // 6. Company-Specific Intelligence
  if (q.includes('amazon') || q.includes('sde') || q.includes('leadership principle')) {
    return `### 📦 Cracking Amazon SDE-1

Amazon evaluates candidates equally on **Algorithmic DSA** and the **16 Leadership Principles (LPs)**:

#### 1. Round Structure
- **Round 1 (OA)**: 2 coding questions (Trees/Graphs/DP) + Work Simulation.
- **Rounds 2-4 (Virtual Technical)**: 45-60 min each. Every round begins with **15-20 min of LP probing** followed by 1-2 coding problems.

#### 2. High-Frequency Amazon Topics
- **Trees & Graphs**: BFS/DFS, Topological Sort (*Course Schedule*), Lowest Common Ancestor.
- **Two Pointers**: *Subarray Sum Equals K*, *Longest Substring Without Repeating Characters*.
- **Heaps & Priority Queues**: *Top K Frequent Elements*, *Merge K Sorted Lists*.
- **Design/LLD**: *LRU Cache* (Amazon's most-reported question!).

#### 3. Top Amazon LPs to Prepare
1. **Customer Obsession**
2. **Ownership**
3. **Bias for Action**
4. **Deliver Results**

Prepare at least **2 STAR stories** for each principle!`;
  }

  if (q.includes('google') || q.includes('googleyness')) {
    return `### 🔍 Cracking Google Software Engineer (SWE)

Google focuses deeply on algorithm efficiency, code elegance, and structural abstraction:

#### Key Focus Areas:
1. **Advanced Graphs & DP**: Shortest path algorithms (Dijkstra), Segment Trees, Trie, Multi-dimensional DP.
2. **Code Cleanliness**: Interviews are conducted in plain text / Google Docs with **no syntax highlighting or autocompletion**.
3. **Edge Case Coverage**: Before coding, explicitly discuss boundary cases (empty inputs, negative numbers, 64-bit integer overflow).

#### Top Google Problems:
- *Median of Two Sorted Arrays*
- *Trapping Rain Water*
- *Alien Dictionary*
- *Shortest Path in a Grid with Obstacles Elimination*`;
  }

  if (q.includes('microsoft')) {
    return `### 🪟 Cracking Microsoft Software Engineer (SWE)

Microsoft balances foundational Computer Science with algorithmic problem solving:

#### Key Focus Areas:
1. **Data Structures**: Linked Lists (*Reverse Nodes in k-Group*), Binary Search Trees, Matrix Spiral Traversal.
2. **Low-Level Design (LLD)**: Object-Oriented Design patterns (Design a Parking Lot, Deck of Cards, Elevator System).
3. **Core CS**: Strong focus on Operating Systems (Processes vs Threads, Concurrency, Virtual Memory) and DBMS.
4. **Loop Structure**: 1 Online Assessment + 3 Technical Rounds + 1 AA (As Appropriate / Partner Director) round.`;
  }

  // 7. Dynamic Programming
  if (q.includes('dp') || q.includes('dynamic programming')) {
    return `### ⚡ Dynamic Programming — 3-Step Mastery Framework

Dynamic Programming is simply recursion with memoization to avoid redundant computations.

#### 3-Step Framework:
1. **Define the State**: What variables uniquely identify a subproblem? (e.g. \`dp[i][w]\` = max value using first \`i\` items with weight capacity \`w\`).
2. **Formulate the Transition**: How does the answer for current state depend on smaller subproblems? (e.g. \`dp[i] = dp[i-1] + dp[i-2]\`).
3. **Base Cases & Iteration Direction**: Identify the smallest subproblems (e.g. \`dp[0] = 0, dp[1] = 1\`).

#### Must-Know DP Patterns:
- **0/1 Knapsack**: Subset Sum, Target Sum.
- **Longest Common Subsequence (LCS)**: Edit Distance, Longest Palindromic Subsequence.
- **Matrix / Grid**: Unique Paths, Minimum Path Sum.
- **Interval DP**: Burst Balloons, Matrix Chain Multiplication.`;
  }

  // 8. System Design / LLD
  if (q.includes('system design') || q.includes('lld') || q.includes('hld') || q.includes('youtube') || q.includes('tinyurl')) {
    return `### 🏗️ System Design Framework for Interviews

#### High-Level Design (HLD) Checklist:
1. **Requirement Clarification**: Functional (features) vs Non-Functional (latency, availability, scale).
2. **Scale Estimation (Back of Envelope)**: Read/Write ratio, QPS, Storage needed for 5 years.
3. **High-Level Components**:
   - Clients → DNS → Load Balancer → API Gateway → Application Microservices.
   - Read Cache (Redis) → Primary DB (Write) & Read Replicas.
   - Message Queues (Kafka / RabbitMQ) for asynchronous processing.
   - Object Storage (S3) for media files + CDN (Cloudflare) for global low latency.

#### Top Problems:
- **Design YouTube / Netflix**: Chunking video, transcoding, CDN distribution, metadata DB.
- **Design URL Shortener**: Base62 hash generation, collision resolution, cache layer.
- **Design LRU Cache (LLD)**: Doubly Linked List + Hash Map (O(1) get and put).`;
  }

  // 9. Core CS: Operating Systems
  if (q.includes('os') || q.includes('operating system') || q.includes('deadlock') || q.includes('process') || q.includes('thread')) {
    return `### 💻 Operating Systems Essentials

Top questions asked in campus technical interviews:

1. **Process vs Thread**:
   - **Process**: Independent execution environment with its own isolated address space, heap, and open handles.
   - **Thread**: Belongs to a process; shares memory/heap with peer threads, but has its own stack and registers.

2. **Deadlock Conditions (Coffman Conditions)**:
   - *Mutual Exclusion*, *Hold and Wait*, *No Preemption*, *Circular Wait*.
   - Prevention: Lock hierarchy (always acquire resources in a strict global order).

3. **Virtual Memory & Paging**:
   - Maps virtual addresses to physical RAM via Page Tables and TLB (Translation Lookaside Buffer).
   - Page Fault occurs when requested data is swapped to disk.`;
  }

  // 10. Core CS: DBMS & SQL
  if (q.includes('dbms') || q.includes('sql') || q.includes('database') || q.includes('acid') || q.includes('nosql')) {
    return `### 🗄️ DBMS & SQL Essentials for Placements

1. **ACID Properties**:
   - **Atomicity**: All operations succeed or all roll back.
   - **Consistency**: Invariants and constraints remain valid.
   - **Isolation**: Concurrent transactions execute as if sequential.
   - **Durability**: Committed data persists even across server crashes.

2. **B+ Tree Indexing**:
   - Why B+ Trees instead of Binary Search Trees? Shallow tree height, high fan-out, and leaf-level linked lists for high-speed range queries.

3. **SQL vs NoSQL**:
   - **SQL (Postgres/MySQL)**: Structured schema, ACID, complex multi-table JOINs, vertical scaling.
   - **NoSQL (MongoDB/Cassandra)**: Dynamic schema, horizontal scaling (sharding), high write throughput.`;
  }

  // 11. Resume & Placement Tips
  if (q.includes('resume') || q.includes('placement') || q.includes('off campus') || q.includes('on campus') || q.includes('interview tip')) {
    return `### 🚀 Top Campus Placement Advice

1. **Resume Formula**:
   - Use Google's XYZ formula: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
   - Keep it strictly to **1 page**.
   - Highlight links to your live projects and GitHub profile.

2. **Technical Preparation Roadmap**:
   - Master the Top 75 LeetCode problems (Arrays, Two Pointers, Trees, Graphs, DP).
   - Don't just read solutions — write and dry-run code on paper or a whiteboard.
   - Prepare your project deep dives: be ready to explain the database schema, architectural tradeoffs, and what you'd improve.

3. **During the Interview**:
   - Never stay silent for more than 30 seconds. Vocalize your thoughts: *"I'm thinking of using a HashMap here to achieve O(N) lookup..."*
   - Ask clarifying questions about constraints before writing a single line of code!`;
  }

  // 12. Smart fallback that acknowledges the question naturally
  return `### 💡 Placement Advice: "${raw}"

Here are key preparation steps for this:

1. **Core Concept**:
   - Make sure you can articulate the fundamental tradeoffs (time vs space complexity).
   - Practice related problems in the **Company Prep > Question Bank** section.
2. **Interview Strategy**:
   - Start with a brute-force solution to demonstrate baseline understanding, then optimize step-by-step.
   - Relate your answers to real-world scenarios or project implementations.

💬 *Ask me about specific topics like "STAR method", "Amazon SDE", "Dynamic Programming", "System Design", or "How to use this website" anytime!*`;
}

export function aiChatRouter() {
  const router = Router();

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

    // 1. If Gemini API key is configured, use real Gemini 1.5 Flash
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
      }
    }

    // 2. Intelligent built-in knowledge & website guidance engine
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
