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

Keep answers:
- Concise and structured (use bullet points, numbered lists where helpful)
- Practical with real examples and LeetCode problem references
- Encouraging and supportive
- Focused on interview preparation

If asked something unrelated to interview prep or tech careers, politely redirect to your core purpose.`;

let genAI = null;
let aiEnabled = false;

function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    aiEnabled = true;
  }
  return genAI;
}

export function aiChatRouter() {
  const router = Router();

  router.get('/ai/status', (req, res) => {
    res.json({ data: { enabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') } });
  });

  router.post('/ai/chat', asyncRoute(async (req, res) => {
    const { message, history } = parseInput(messageSchema, req.body);

    const client = getGenAI();
    if (!client) {
      throw new ApiError(503, 'AI_UNAVAILABLE', 'AI assistant is not configured. Add GEMINI_API_KEY to .env file.');
    }

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

    res.json({
      data: {
        reply: text,
        newHistoryEntry: {
          role: 'model',
          parts: [{ text }]
        }
      }
    });
  }));

  return router;
}
