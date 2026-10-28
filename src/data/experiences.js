export const EXPERIENCES_DATA = [
  {
    id: "exp-1",
    company: "Amazon",
    companySlug: "amazon",
    companyName: "Amazon",
    role: "SDE-1 (Full Time)",
    year: 2026,
    createdAt: "2026-10-15T09:30:00Z",
    userId: "user-201",
    authorName: "Rohan Varma",
    anonymous: false,
    result: "Selected",
    difficulty: 4.0,
    rounds: [
      {
        type: "Online Assessment (OA)",
        duration: "90 min",
        difficulty: "Medium",
        topics: "Arrays, Priority Queue, Amazon Work Simulation",
        questions: "Find the minimum total cost to connect all cables (Min Heap), Subarray sum divisible by K"
      },
      {
        type: "Technical Round 1 (Data Structures)",
        duration: "60 min",
        difficulty: "Medium",
        topics: "Hash Tables, Linked Lists, Leadership Principles",
        questions: "LRU Cache Implementation, LP: Tell me about a time you had to deliver under tight deadlines"
      },
      {
        type: "Technical Round 2 (Algorithms & Graphs)",
        duration: "60 min",
        difficulty: "Hard",
        topics: "BFS, Topological Sorting, Leadership Principles",
        questions: "Course Schedule II, Word Ladder variation, LP: Disagree and Commit story"
      },
      {
        type: "Bar Raiser Round (System & Leadership)",
        duration: "60 min",
        difficulty: "Hard",
        topics: "Low Level Design, Concurrency, Customer Obsession",
        questions: "Design Amazon Locker Management System with concurrent locker booking, In-depth LP drill-down"
      }
    ],
    topics: ["Priority Queue", "Hash Tables", "LRU Cache", "Topological Sort", "Low Level Design", "Leadership Principles"],
    questions: ["LRU Cache Implementation", "Course Schedule II", "Design Amazon Locker System"],
    prepAdvice: "Do not underestimate Amazon's Leadership Principles! The Bar Raiser spent 25 full minutes questioning the trade-offs I made in my final-year project. Write down 2 STAR stories for every LP before the interview.",
    candidateExperience: "The interviewers were very supportive and gave subtle hints when I was stuck on the locker synchronization logic. Overall an intellectually rewarding experience.",
    status: "approved",
    helpfulVotes: 64,
    channel: "On-Campus Drive",
    location: "Bangalore, India",
    ctc: "₹45 LPA (Base 18L + Stocks + Joining Bonus)",
    verified: true
  },
  {
    id: "exp-2",
    company: "Google",
    companySlug: "google",
    companyName: "Google",
    role: "Software Engineering Intern",
    year: 2026,
    createdAt: "2026-10-18T14:15:00Z",
    userId: "user-202",
    authorName: "Ananya Sharma",
    anonymous: false,
    result: "Selected",
    difficulty: 4.8,
    rounds: [
      {
        type: "Online Assessment (OA)",
        duration: "60 min",
        difficulty: "Hard",
        topics: "Segment Tree, Dynamic Programming",
        questions: "Range Query with point updates, Shortest Path in Matrix with Obstacles"
      },
      {
        type: "Technical Interview 1",
        duration: "45 min",
        difficulty: "Hard",
        topics: "Graphs, Greedy Algorithms",
        questions: "Alien Dictionary topological sort with cycle detection, followed by memory optimization for stream"
      },
      {
        type: "Technical Interview 2",
        duration: "45 min",
        difficulty: "Hard",
        topics: "Monotonic Queue, Tree Traversal",
        questions: "Sliding Window Maximum variation, Binary Tree Maximum Path Sum with negative values"
      },
      {
        type: "Googleyness & Fit Round",
        duration: "45 min",
        difficulty: "Medium",
        topics: "Ethical Dilemmas, Collaboration, Ambiguity",
        questions: "How do you navigate when your teammate strongly opposes your technical stack proposal?"
      }
    ],
    topics: ["Segment Tree", "Topological Sort", "Sliding Window", "Googleyness"],
    questions: ["Alien Dictionary", "Sliding Window Maximum", "Shortest Path in a Grid"],
    prepAdvice: "Solve 200+ LeetCode Medium/Hard without checking solutions for at least 30 minutes. Communicate your thought process loudly before writing a single line of code. Google interviewers care deeply about how you recover from flawed assumptions.",
    candidateExperience: "Challenging but exhilarating! Google uses a shared Google Doc without syntax highlighting, so practice writing clean syntax and naming meaningful variables.",
    status: "approved",
    helpfulVotes: 89,
    channel: "Off-Campus / Referral",
    location: "Hyderabad, India",
    ctc: "₹1.25 Lakh / month stipend + PPO track",
    verified: true
  },
  {
    id: "exp-3",
    company: "Microsoft",
    companySlug: "microsoft",
    companyName: "Microsoft",
    role: "Software Engineer",
    year: 2026,
    createdAt: "2026-10-12T11:00:00Z",
    userId: "user-203",
    authorName: "Anonymous Candidate",
    anonymous: true,
    result: "Selected",
    difficulty: 3.6,
    rounds: [
      {
        type: "Online Assessment",
        duration: "75 min",
        difficulty: "Medium",
        topics: "Strings, Arrays, Dynamic Programming",
        questions: "Min deletions to make frequency of each character unique, Jump Game II"
      },
      {
        type: "Technical Round 1",
        duration: "50 min",
        difficulty: "Medium",
        topics: "Binary Trees, Pointers, Operating Systems",
        questions: "Serialize and Deserialize Binary Tree, Difference between Virtual Memory and Paging"
      },
      {
        type: "Technical Round 2 (Design & Core CS)",
        duration: "50 min",
        difficulty: "Medium",
        topics: "Low Level Design, Concurrency",
        questions: "Design Parking Lot System with OOP SOLID principles, Mutex vs Semaphore implementation"
      },
      {
        type: "Director (AA Round)",
        duration: "45 min",
        difficulty: "Medium",
        topics: "System Architecture, Microsoft Values",
        questions: "Explain architecture of your college capstone project, why Azure over AWS, growth mindset questions"
      }
    ],
    topics: ["Binary Trees", "Low Level Design", "Virtual Memory", "Concurrency"],
    questions: ["Serialize and Deserialize Binary Tree", "Design Parking Lot System"],
    prepAdvice: "Microsoft loves deep CS fundamentals! Revise Operating Systems (Tanenbaum or Galvin) and DBMS ACID properties. For DSA, master Trees and Linked Lists.",
    candidateExperience: "Very collaborative atmosphere. The As Appropriate round was more of a casual conversation about passions and engineering culture.",
    status: "approved",
    helpfulVotes: 42,
    channel: "On-Campus Drive",
    location: "Noida / Virtual",
    ctc: "₹42 LPA (Base 16L + Bonus + Stocks)",
    verified: true
  },
  {
    id: "exp-4",
    company: "Goldman Sachs",
    companySlug: "goldman-sachs",
    companyName: "Goldman Sachs",
    role: "New Analyst (Engineering)",
    year: 2026,
    createdAt: "2026-10-08T16:20:00Z",
    userId: "user-204",
    authorName: "Priya Nair",
    anonymous: false,
    result: "Selected",
    difficulty: 4.1,
    rounds: [
      {
        type: "HackerRank Assessment",
        duration: "105 min",
        difficulty: "Hard",
        topics: "Quant Math, Probability, 2 Coding Problems",
        questions: "25 Horses Puzzle, First Non-Repeating Character in Stream, Minimum Platforms"
      },
      {
        type: "Superday Tech Round 1",
        duration: "45 min",
        difficulty: "Medium",
        topics: "Dynamic Programming, Hash Tables",
        questions: "Trapping Rain Water with 2-pointer optimization, Coin Change problem"
      },
      {
        type: "Superday Tech Round 2",
        duration: "45 min",
        difficulty: "Hard",
        topics: "Java Concurrency, Memory Leak Debugging, OOP",
        questions: "Implement thread-safe Singleton, explain garbage collection in JVM, deadlock simulation"
      },
      {
        type: "Leadership & Cultural Fit",
        duration: "30 min",
        difficulty: "Medium",
        topics: "Integrity, High-Pressure Financial Scenarios",
        questions: "What would you do if a production trade discrepancy occurs 5 minutes before market close?"
      }
    ],
    topics: ["Quant Puzzles", "Trapping Rain Water", "Java Concurrency", "Probability"],
    questions: ["Trapping Rain Water", "First Non-Repeating Character in Stream"],
    prepAdvice: "Brush up on standard quant puzzles (Brainstellar, GFG Puzzles) and Java memory internals. Goldman interviewers test whether you can remain calm under time pressure.",
    candidateExperience: "Superday was intense with back-to-back rounds, but the recruiters kept us motivated and fed throughout the day.",
    status: "approved",
    helpfulVotes: 51,
    channel: "On-Campus Drive",
    location: "Bangalore, India",
    ctc: "₹32 LPA + Performance Bonus",
    verified: true
  },
  {
    id: "exp-5",
    company: "Meta",
    companySlug: "meta",
    companyName: "Meta",
    role: "Software Engineer (E3)",
    year: 2026,
    createdAt: "2026-09-29T10:10:00Z",
    userId: "user-205",
    authorName: "Karthik Iyer",
    anonymous: false,
    result: "Rejected",
    difficulty: 4.5,
    rounds: [
      {
        type: "Technical Screen",
        duration: "45 min",
        difficulty: "Hard",
        topics: "Speed Coding, Hash Maps, Binary Search",
        questions: "Subarray Sum Equals K, K Closest Points to Origin"
      },
      {
        type: "Onsite Round 1 (Coding)",
        duration: "45 min",
        difficulty: "Hard",
        topics: "Binary Trees, Pointers",
        questions: "Lowest Common Ancestor III (with parent pointer), Dot Product of Two Sparse Vectors"
      },
      {
        type: "Onsite Round 2 (Coding)",
        duration: "45 min",
        difficulty: "Hard",
        topics: "Recursion, Backtracking",
        questions: "Word Break II - got stuck on time complexity optimization with memoization"
      }
    ],
    topics: ["Subarray Sum", "Binary Search", "Lowest Common Ancestor", "Memoization"],
    questions: ["Subarray Sum Equals K", "Lowest Common Ancestor of a Binary Tree"],
    prepAdvice: "Meta strictly enforces 2 questions per 45 minutes! I solved question 1 in 28 minutes, leaving only 17 minutes for question 2 which wasn't enough. Timed speed practice on Meta-tagged questions is mandatory.",
    candidateExperience: "Even though I was rejected, the recruiter provided detailed breakdown feedback. Will re-apply after the 6-month cooldown.",
    status: "approved",
    helpfulVotes: 73,
    channel: "Off-Campus / Referral",
    location: "London / Remote",
    ctc: "£85,000 + Equity",
    verified: true
  },
  {
    id: "exp-6",
    company: "D. E. Shaw",
    companySlug: "de-shaw",
    companyName: "D. E. Shaw",
    role: "Member Technical (MTS)",
    year: 2026,
    createdAt: "2026-10-20T17:40:00Z",
    userId: "user-206",
    authorName: "Devansh Rastogi",
    anonymous: false,
    result: "Selected",
    difficulty: 4.9,
    rounds: [
      {
        type: "Coding Assessment",
        duration: "90 min",
        difficulty: "Hard",
        topics: "Heavy DP, Bit Manipulation, Graphs",
        questions: "Bitmask DP on tree paths, Minimum Spanning Tree with custom constraints"
      },
      {
        type: "Technical Interview 1 (OS & Core Systems)",
        duration: "60 min",
        difficulty: "Hard",
        topics: "Virtual Memory, Socket Programming, Linux Kernel",
        questions: "How does epoll differ from select/poll? Write a multi-process shared memory buffer with semaphores"
      },
      {
        type: "Technical Interview 2 (Advanced Algorithmic)",
        duration: "60 min",
        difficulty: "Hard",
        topics: "Segment Trees, Monotonic Deque",
        questions: "Sliding Window Maximum, Longest Increasing Path in a Matrix with strict proofs"
      },
      {
        type: "Technical Interview 3 & HR",
        duration: "60 min",
        difficulty: "Medium",
        topics: "System Design, Analytical Depth",
        questions: "Design a high-frequency order book matching engine with nanosecond latency constraints"
      }
    ],
    topics: ["Bitmask DP", "Operating Systems Internals", "Sliding Window", "Segment Trees"],
    questions: ["Sliding Window Maximum", "Virtual Memory, Paging, and Page Fault Handling"],
    prepAdvice: "Don't just practice LeetCode — read Linux man pages, understand how the OS scheduler interacts with CPU cache lines (L1/L2/L3), and solve Codeforces Div 2 (C/D/E).",
    candidateExperience: "One of the most technically demanding yet respectful interview panels I have ever faced. Every interviewer was extremely sharp.",
    status: "approved",
    helpfulVotes: 95,
    channel: "On-Campus Drive",
    location: "Hyderabad, India",
    ctc: "₹52 LPA (Base 24L + 28L Retentions & Bonus)",
    verified: true
  }
];
