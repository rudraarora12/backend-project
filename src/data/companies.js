export const COMPANIES_DATA = [
  {
    id: "comp-1",
    slug: "amazon",
    name: "Amazon",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(255, 153, 0, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#FF9900",
    experienceCount: 142,
    questionsCount: 284,
    recentExperiencesCount: 19,
    avgDifficulty: 3.8,
    popularRoles: ["SDE-1 (Full Time)", "SDE Intern", "Cloud Support Associate"],
    topTopics: ["Trees & Graphs", "Leadership Principles", "Dynamic Programming", "System Design"],
    pattern: [
      { label: "DSA & Problem Solving", percentage: 45 },
      { label: "Behavioral & LPs", percentage: 25 },
      { label: "System & OOD Design", percentage: 15 },
      { label: "OS / DBMS Fundamentals", percentage: 15 }
    ],
    freqQuestions: [
      { id: "q-amz-1", title: "LRU Cache Implementation", reports: 88 },
      { id: "q-amz-2", title: "Word Ladder I & II", reports: 74 },
      { id: "q-amz-3", title: "Course Schedule (Topological Sort)", reports: 69 },
      { id: "q-amz-4", title: "Design Hit Counter / Amazon Locker", reports: 58 },
      { id: "q-amz-5", title: "Number of Islands", reports: 92 }
    ],
    overview: "Amazon's hiring process is uniquely balanced between rigorous algorithmic problem solving and Amazon's 16 Leadership Principles (LPs). Expect 1 Online Assessment (OA) with 2 coding questions + work simulation, followed by 3 to 4 virtual technical interviews. In each round, 15-20 minutes are strictly dedicated to STAR method behavioral LP probes."
  },
  {
    id: "comp-2",
    slug: "google",
    name: "Google",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#4285F4",
    experienceCount: 128,
    questionsCount: 310,
    recentExperiencesCount: 14,
    avgDifficulty: 4.6,
    popularRoles: ["Software Engineer (L3)", "Software Engineering Intern", "Application Engineer"],
    topTopics: ["Graph Algorithms", "Segment Trees & Trie", "Dynamic Programming", "Googleyness"],
    pattern: [
      { label: "Advanced DSA", percentage: 65 },
      { label: "Data Structures Crafting", percentage: 15 },
      { label: "System Architecture", percentage: 10 },
      { label: "Googleyness & Leadership", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-goog-1", title: "Shortest Path in a Grid with Obstacles Elimination", reports: 82 },
      { id: "q-goog-2", title: "Trapping Rain Water", reports: 79 },
      { id: "q-goog-3", title: "Median of Two Sorted Arrays", reports: 63 },
      { id: "q-goog-4", title: "Design Search Autocomplete System", reports: 56 },
      { id: "q-goog-5", title: "Alien Dictionary", reports: 68 }
    ],
    overview: "Google focuses intensely on code cleanliness, time/space complexity optimization, edge-case coverage, and structural abstraction. Standard rounds consist of 1 OA followed by 4-5 on-site technical rounds (45 mins each) with no IDE syntax highlighting or autocompletion allowed."
  },
  {
    id: "comp-3",
    slug: "microsoft",
    name: "Microsoft",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    bgGradient: "linear-gradient(135deg, rgba(0, 164, 239, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#00A4EF",
    experienceCount: 115,
    questionsCount: 240,
    recentExperiencesCount: 16,
    avgDifficulty: 3.7,
    popularRoles: ["Software Engineer", "SWE Intern", "Support Engineer"],
    topTopics: ["Binary Trees", "Linked Lists & Strings", "OS & Multithreading", "OOP Design"],
    pattern: [
      { label: "DSA & Problem Solving", percentage: 40 },
      { label: "OS, Concurrency & Threads", percentage: 25 },
      { label: "Low Level Design (LLD)", percentage: 20 },
      { label: "Core CS (DBMS / Networks)", percentage: 15 }
    ],
    freqQuestions: [
      { id: "q-msft-1", title: "Serialize and Deserialize Binary Tree", reports: 77 },
      { id: "q-msft-2", title: "Spiral Matrix", reports: 61 },
      { id: "q-msft-3", title: "Reverse Nodes in k-Group", reports: 59 },
      { id: "q-msft-4", title: "Design Parking Lot System (LLD)", reports: 64 },
      { id: "q-msft-5", title: "Producer-Consumer Multi-threaded Buffer", reports: 49 }
    ],
    overview: "Microsoft evaluates deep foundation in Operating Systems (memory management, threads vs processes, deadlock handling), Object-Oriented design patterns, and clean tree/graph algorithms. The hiring loop typically includes 1 online test + 3 technical rounds + 1 AA (As Appropriate / Partner Director) round."
  },
  {
    id: "comp-4",
    slug: "meta",
    name: "Meta",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(6, 104, 225, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#0668E1",
    experienceCount: 88,
    questionsCount: 195,
    recentExperiencesCount: 8,
    avgDifficulty: 4.3,
    popularRoles: ["Software Engineer (E3/E4)", "Production Engineer", "SWE Intern"],
    topTopics: ["Binary Search", "Hash Tables", "BFS/DFS Graphs", "System Design"],
    pattern: [
      { label: "High-Speed DSA", percentage: 55 },
      { label: "System Design (Scalability)", percentage: 25 },
      { label: "Behavioral & Cultural", percentage: 10 },
      { label: "Bug Finding & Code Mod", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-meta-1", title: "K Closest Points to Origin", reports: 72 },
      { id: "q-meta-2", title: "Lowest Common Ancestor of a Binary Tree III", reports: 68 },
      { id: "q-meta-3", title: "Subarray Sum Equals K", reports: 85 },
      { id: "q-meta-4", title: "Dot Product of Two Sparse Vectors", reports: 64 },
      { id: "q-meta-5", title: "Design News Feed / Messenger", reports: 51 }
    ],
    overview: "Meta demands velocity and clean, bug-free execution: candidates are expected to crack 2 medium/hard algorithmic problems within a single 45-minute technical session. Meta frequently pulls from its top 100 tagged LeetCode questions."
  },
  {
    id: "comp-5",
    slug: "uber",
    name: "Uber",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    bgGradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(13, 21, 39, 0.8))",
    accentColor: "#FFFFFF",
    experienceCount: 76,
    questionsCount: 168,
    recentExperiencesCount: 11,
    avgDifficulty: 4.4,
    popularRoles: ["Software Engineer 1", "SDE-2", "Data Engineer"],
    topTopics: ["QuadTrees & Spatial Indexing", "Shortest Path (Dijkstra)", "Dynamic Programming", "LLD/HLD"],
    pattern: [
      { label: "Complex Graph / Geometry DSA", percentage: 45 },
      { label: "High Level Design / Geohashing", percentage: 30 },
      { label: "Concurrency & Concurrency Locks", percentage: 15 },
      { label: "Architecture / Culture Fit", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-uber-1", title: "Design Ride Hailing System / Uber Dispatcher", reports: 66 },
      { id: "q-uber-2", title: "Bus Routes (BFS with Route Transfer)", reports: 59 },
      { id: "q-uber-3", title: "Word Break II", reports: 48 },
      { id: "q-uber-4", title: "Design Rate Limiter", reports: 53 },
      { id: "q-uber-5", title: "Find All Anagrams in a String", reports: 42 }
    ],
    overview: "Uber's interviews emphasize real-world geolocation problem modeling, concurrency, geohashing (H3 algorithm concepts), and robust distributed systems design."
  },
  {
    id: "comp-6",
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    category: "Fintech",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
    bgGradient: "linear-gradient(135deg, rgba(115, 153, 198, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#7399C6",
    experienceCount: 94,
    questionsCount: 210,
    recentExperiencesCount: 13,
    avgDifficulty: 4.0,
    popularRoles: ["Analyst - Global Markets", "New Analyst (Engineering)", "Summer Analyst"],
    topTopics: ["Probability & Math Puzzles", "Dynamic Programming", "Hash Tables", "Java Concurrency"],
    pattern: [
      { label: "Data Structures & Strings", percentage: 35 },
      { label: "Math, Quant Puzzles & Probability", percentage: 30 },
      { label: "OOPs & Memory Management", percentage: 20 },
      { label: "Behavioral & Financial Interest", percentage: 15 }
    ],
    freqQuestions: [
      { id: "q-gs-1", title: "Trapping Rain Water", reports: 74 },
      { id: "q-gs-2", title: "First Non-Repeating Character in Stream", reports: 65 },
      { id: "q-gs-3", title: "High Five (Student Top 5 Average)", reports: 58 },
      { id: "q-gs-4", title: "25 Horses 5 Tracks Puzzle", reports: 81 },
      { id: "q-gs-5", title: "Coin Change (Min Coins & Total Ways)", reports: 52 }
    ],
    overview: "Goldman Sachs evaluates candidates through a HackerRank assessment with advanced math/puzzle MCQs and 2 coding tasks, followed by multiple 45-minute Superday rounds exploring edge cases, time/space trade-offs, and quant problem solving."
  },
  {
    id: "comp-7",
    slug: "de-shaw",
    name: "D. E. Shaw",
    category: "Fintech",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/D._E._Shaw_%26_Co._logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#00D4FF",
    experienceCount: 46,
    questionsCount: 112,
    recentExperiencesCount: 5,
    avgDifficulty: 4.8,
    popularRoles: ["Member Technical (MTS)", "Software Developer Intern", "Systems Analyst"],
    topTopics: ["Segment Trees", "Operating Systems Internals", "Heavy DP", "Network Sockets"],
    pattern: [
      { label: "Hard Hard DSA & Trees", percentage: 50 },
      { label: "In-depth OS & System Calls", percentage: 25 },
      { label: "DBMS Query Optimizations & ACID", percentage: 15 },
      { label: "Quant & Analytical Thinking", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-deshaw-1", title: "Sliding Window Maximum", reports: 41 },
      { id: "q-deshaw-2", title: "Binary Tree Maximum Path Sum", reports: 37 },
      { id: "q-deshaw-3", title: "Implement Virtual Memory Simulator", reports: 28 },
      { id: "q-deshaw-4", title: "Longest Increasing Path in a Matrix", reports: 35 },
      { id: "q-deshaw-5", title: "B+ Tree Indexing Architecture Probing", reports: 30 }
    ],
    overview: "D. E. Shaw is known for one of the most grueling campus recruitment drives. Questions demand deep mastery of CS fundamentals: virtual memory, page replacement algorithms, mutexes, socket programming, and CP-level graph and DP problems."
  },
  {
    id: "comp-8",
    slug: "adobe",
    name: "Adobe",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    bgGradient: "linear-gradient(135deg, rgba(255, 0, 0, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#FF0000",
    experienceCount: 71,
    questionsCount: 155,
    recentExperiencesCount: 7,
    avgDifficulty: 3.7,
    popularRoles: ["MTS-1", "Product Intern", "Quality Engineer"],
    topTopics: ["Trees & BST", "Dynamic Programming", "C++ STL / Pointers", "Computer Graphics"],
    pattern: [
      { label: "DSA & Recursion", percentage: 45 },
      { label: "C++ / Memory / Pointers", percentage: 25 },
      { label: "OOP & Design Patterns", percentage: 15 },
      { label: "DBMS & Behavioral", percentage: 15 }
    ],
    freqQuestions: [
      { id: "q-adobe-1", title: "Flatten a Multilevel Doubly Linked List", reports: 48 },
      { id: "q-adobe-2", title: "Merge k Sorted Lists", reports: 51 },
      { id: "q-adobe-3", title: "Construct Binary Tree from Inorder & Postorder", reports: 44 },
      { id: "q-adobe-4", title: "Virtual Destructors & VTABLE Internals", reports: 39 },
      { id: "q-adobe-5", title: "Word Break problem", reports: 41 }
    ],
    overview: "Adobe tests algorithmic fluency paired with deep C/C++ foundation, smart pointers, and memory manipulation. Expect 1 online assessment and 3 technical rounds focusing on tree transformations and complex data structures."
  },
  {
    id: "comp-9",
    slug: "atlassian",
    name: "Atlassian",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Atlassian_logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(0, 82, 204, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#0052CC",
    experienceCount: 52,
    questionsCount: 125,
    recentExperiencesCount: 6,
    avgDifficulty: 4.2,
    popularRoles: ["Graduate Software Engineer", "Associate Product Manager", "SWE Intern"],
    topTopics: ["System Design / LLD", "Clean Code & Refactoring", "DSA Graphs", "Company Values"],
    pattern: [
      { label: "Coding & Clean Design", percentage: 40 },
      { label: "Low Level Design (LLD)", percentage: 30 },
      { label: "Values & Behavioral (Open Company)", percentage: 20 },
      { label: "System Architecture", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-atl-1", title: "Design File System with Tag Filtering", reports: 45 },
      { id: "q-atl-2", title: "Design Snake Game", reports: 38 },
      { id: "q-atl-3", title: "Find Top K Most Frequent Tags across Documents", reports: 35 },
      { id: "q-atl-4", title: "Design Jira Issue Workflow Engine", reports: 33 },
      { id: "q-atl-5", title: "Course Schedule II", reports: 30 }
    ],
    overview: "Atlassian tests writeable, production-ready code with unit tests, SOLID principles, and defensive programming. Their values interview ('Open company, no bullshit', 'Don't #@!% the customer') is a critical hiring gate."
  },
  {
    id: "comp-10",
    slug: "apple",
    name: "Apple",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    bgGradient: "linear-gradient(135deg, rgba(160, 160, 160, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#A2AAAD",
    experienceCount: 65,
    questionsCount: 140,
    recentExperiencesCount: 5,
    avgDifficulty: 4.1,
    popularRoles: ["Software Engineer (Applications)", "Firmware / Embedded Engineer", "SWE Intern"],
    topTopics: ["Bit Manipulation", "Concurrent Queues", "Trees & Graphs", "Memory & Hardware Architecture"],
    pattern: [
      { label: "Data Structures & Algos", percentage: 40 },
      { label: "Architecture / Memory Management", percentage: 30 },
      { label: "Domain Specialization (Swift/C++)", percentage: 20 },
      { label: "Collaboration & Attention to Detail", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-appl-1", title: "Implement LRU Cache with TTL", reports: 42 },
      { id: "q-appl-2", title: "Reverse Bits / Count Set Bits", reports: 37 },
      { id: "q-appl-3", title: "Design Thread-Safe Circular Buffer", reports: 34 },
      { id: "q-appl-4", title: "Two Sum & 3Sum Closest", reports: 45 },
      { id: "q-appl-5", title: "Valid Palindrome with At Most 1 Deletion", reports: 38 }
    ],
    overview: "Apple's hiring is team-specific. They evaluate precision, memory constraints, latency optimization, and algorithmic execution with high aesthetic bar and structural elegance."
  },
  {
    id: "comp-11",
    slug: "netflix",
    name: "Netflix",
    category: "Product",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(229, 9, 20, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#E50914",
    experienceCount: 41,
    questionsCount: 96,
    recentExperiencesCount: 4,
    avgDifficulty: 4.7,
    popularRoles: ["Software Engineer (L4/L5)", "New Grad SWE", "Distributed Systems Intern"],
    topTopics: ["Distributed Systems", "High Throughput Caching", "Microservices", "Culture Memo"],
    pattern: [
      { label: "High Level System Design", percentage: 40 },
      { label: "Complex Algorithmic Scaling", percentage: 30 },
      { label: "Netflix Culture & Freedom/Responsibility", percentage: 20 },
      { label: "Fault Tolerance & Chaos Engineering", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-nflx-1", title: "Design Video Streaming CDN & Transcoder", reports: 36 },
      { id: "q-nflx-2", title: "LFU Cache Implementation", reports: 29 },
      { id: "q-nflx-3", title: "Design Real-Time Recommendation Metrics Pipeline", reports: 26 },
      { id: "q-nflx-4", title: "Task Scheduler with Cooldown & Priorities", reports: 31 },
      { id: "q-nflx-5", title: "Consistent Hashing Ring Implementation", reports: 24 }
    ],
    overview: "Netflix looks for mature engineering judgment, deep understanding of distributed consistency, resilience patterns, and strong alignment with their iconic Freedom & Responsibility memo."
  },
  {
    id: "comp-12",
    slug: "tcs-digital",
    name: "TCS Digital / Prime",
    category: "Service",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    bgGradient: "linear-gradient(135deg, rgba(0, 168, 204, 0.15), rgba(13, 21, 39, 0.8))",
    accentColor: "#00A8CC",
    experienceCount: 215,
    questionsCount: 390,
    recentExperiencesCount: 38,
    avgDifficulty: 3.2,
    popularRoles: ["TCS Prime (9 LPA)", "TCS Digital (7 LPA)", "TCS Ninja (3.6 LPA)"],
    topTopics: ["Arrays & Strings", "DBMS Queries & Normalization", "Java Basics / OOP", "Aptitude"],
    pattern: [
      { label: "DSA & Programming", percentage: 40 },
      { label: "Aptitude & Logical Reasoning", percentage: 30 },
      { label: "Core CS (DBMS / OS / Networks)", percentage: 20 },
      { label: "Managerial & HR Round", percentage: 10 }
    ],
    freqQuestions: [
      { id: "q-tcs-1", title: "Find Nth Fibonacci Number without Recursion", reports: 110 },
      { id: "q-tcs-2", title: "String Permutations & Palindrome Check", reports: 98 },
      { id: "q-tcs-3", title: "Second Highest Salary SQL Query", reports: 145 },
      { id: "q-tcs-4", title: "Inheritance vs Polymorphism in Java", reports: 86 },
      { id: "q-tcs-5", title: "Matrix Rotation by 90 Degrees", reports: 73 }
    ],
    overview: "TCS Digital/Prime is one of the largest campus recruitment drivers across engineering campuses. Recruitment starts with the National Qualifier Test (NQT) covering Advanced Quantitative, Reasoning, and 2 Coding questions, followed by a combined Technical + MR + HR panel."
  }
];
