export const DEFAULT_USER = {
  id: "user-101",
  name: "Alex Rivera",
  email: "alex.rivera@stanford.edu",
  college: "Stanford University",
  degree: "B.S. Computer Science",
  graduationYear: 2026,
  branch: "Computer Science & AI",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
  experiencesShared: 2,
  helpfulVotes: 147,
  bookmarks: {
    companies: ["comp-1", "comp-2"],
    experiences: ["exp-1", "exp-2"],
    questions: ["q-1", "q-2", "q-3"]
  },
  prepState: {
    targetCompany: "amazon",
    targetRole: "SDE-1 (Full Time)",
    prepDays: 7,
    completedDays: [1, 2, 3],
    topicsProgress: {
      "Arrays & Hashing": 100,
      "Two Pointers & Sliding Window": 100,
      "Linked Lists": 100,
      "Trees & BST": 40,
      "Graphs": 0,
      "Dynamic Programming": 0,
      "Behavioral": 20
    }
  }
};

export const INITIAL_ADMIN_QUEUE = [
  {
    id: "sub-901",
    company: "Uber",
    companySlug: "uber",
    companyName: "Uber",
    role: "Software Engineer 1",
    year: 2026,
    authorName: "Nikhil Joshi",
    createdAt: "2026-10-26T18:30:00Z",
    result: "Selected",
    difficulty: 4.2,
    ctc: "₹48 LPA",
    rounds: [
      {
        type: "OA Test",
        duration: "70 min",
        difficulty: "Hard",
        topics: "Graph Traversal, Array Manipulation",
        questions: "Bus Routes BFS transformation, Longest Substring with At Least K Repeating"
      },
      {
        type: "Tech Round 1",
        duration: "45 min",
        difficulty: "Medium",
        topics: "Hash Map, Two Pointers",
        questions: "Subarray Sum Equals K, Design Hit Counter"
      }
    ],
    prepAdvice: "Review spatial indexing and H3 / Geohash algorithms before applying to Uber.",
    status: "pending",
    helpfulVotes: 0,
    channel: "On-Campus Drive",
    location: "Bangalore",
    verified: false
  },
  {
    id: "sub-902",
    company: "Adobe",
    companySlug: "adobe",
    companyName: "Adobe",
    role: "MTS-1",
    year: 2026,
    authorName: "Divya Kulkarni",
    createdAt: "2026-10-25T11:15:00Z",
    result: "Selected",
    difficulty: 3.8,
    ctc: "₹38 LPA",
    rounds: [
      {
        type: "Coding Screening",
        duration: "60 min",
        difficulty: "Medium",
        topics: "Linked Lists, Binary Trees",
        questions: "Flatten Multilevel Doubly Linked List, Merge K Sorted Lists"
      }
    ],
    prepAdvice: "Adobe loves C++ standard library questions. Make sure you can explain virtual destructors and smart pointer internal mechanics.",
    status: "pending",
    helpfulVotes: 0,
    channel: "On-Campus Drive",
    location: "Noida",
    verified: false
  }
];
