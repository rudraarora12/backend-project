export const MASTER_TOPIC_BANK = {
  arrays_hashing: {
    title: "Arrays & Hashing",
    focus: "Prefix sums, hash frequency counters, two sum variations",
    problems: [
      { id: "p-101", title: "Two Sum", difficulty: "Easy", timeMinutes: 15, url: "https://leetcode.com/problems/two-sum/" },
      { id: "p-102", title: "Subarray Sum Equals K", difficulty: "Medium", timeMinutes: 30, url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
      { id: "p-103", title: "Longest Consecutive Sequence", difficulty: "Medium", timeMinutes: 30, url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
      { id: "p-104", title: "First Missing Positive", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/first-missing-positive/" }
    ],
    proTip: "Whenever looking for O(N) lookup time, always test if an inverted Hash Table (mapping value -> index) eliminates an inner loop."
  },
  two_pointers: {
    title: "Two Pointers & Sliding Window",
    focus: "Sorted array convergence, expanding & contracting windows",
    problems: [
      { id: "p-201", title: "3Sum", difficulty: "Medium", timeMinutes: 30, url: "https://leetcode.com/problems/3sum/" },
      { id: "p-202", title: "Trapping Rain Water", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/trapping-rain-water/" },
      { id: "p-203", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", timeMinutes: 25, url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { id: "p-204", title: "Sliding Window Maximum", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/sliding-window-maximum/" }
    ],
    proTip: "In sliding window problems, maintain an invariant. Decide exactly when your window expands (right pointer) and when it must shrink (left pointer)."
  },
  linked_lists: {
    title: "Linked Lists & Fast/Slow Pointers",
    focus: "In-place reversal, cycle detection, dummy head patterns",
    problems: [
      { id: "p-301", title: "Reverse Linked List", difficulty: "Easy", timeMinutes: 15, url: "https://leetcode.com/problems/reverse-linked-list/" },
      { id: "p-302", title: "Merge k Sorted Lists", difficulty: "Hard", timeMinutes: 40, url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { id: "p-303", title: "LRU Cache", difficulty: "Medium", timeMinutes: 45, url: "https://leetcode.com/problems/lru-cache/" },
      { id: "p-304", title: "Reorder List", difficulty: "Medium", timeMinutes: 25, url: "https://leetcode.com/problems/reorder-list/" }
    ],
    proTip: "Always create a `dummy` node pointing to `head` to avoid null-pointer edge cases when mutating the head of a linked list."
  },
  trees_bst: {
    title: "Binary Trees & BST",
    focus: "DFS/BFS traversals, lowest common ancestor, path sums",
    problems: [
      { id: "p-401", title: "Invert Binary Tree", difficulty: "Easy", timeMinutes: 15, url: "https://leetcode.com/problems/invert-binary-tree/" },
      { id: "p-402", title: "Lowest Common Ancestor of BST", difficulty: "Medium", timeMinutes: 25, url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
      { id: "p-403", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { id: "p-404", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
    ],
    proTip: "Recursive tree problems almost always break down into: What do I need from my left child? What do I need from my right child? What do I return to my parent?"
  },
  graphs_dfs_bfs: {
    title: "Graphs: BFS, DFS & Topo Sort",
    focus: "Island matrix traversals, cycle detection, DAG dependency resolution",
    problems: [
      { id: "p-501", title: "Number of Islands", difficulty: "Medium", timeMinutes: 25, url: "https://leetcode.com/problems/number-of-islands/" },
      { id: "p-502", title: "Course Schedule II", difficulty: "Medium", timeMinutes: 35, url: "https://leetcode.com/problems/course-schedule-ii/" },
      { id: "p-503", title: "Word Ladder", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/word-ladder/" },
      { id: "p-504", title: "Alien Dictionary", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/alien-dictionary/" }
    ],
    proTip: "Use Kahn's algorithm (indegree tracking with a queue) for topological sort if you need to detect cycles naturally when count != totalNodes."
  },
  dynamic_programming: {
    title: "Dynamic Programming Foundations",
    focus: "State formulation, 1D/2D memoization, knapsack & LCS patterns",
    problems: [
      { id: "p-601", title: "Climbing Stairs", difficulty: "Easy", timeMinutes: 15, url: "https://leetcode.com/problems/climbing-stairs/" },
      { id: "p-602", title: "Coin Change (Min Coins)", difficulty: "Medium", timeMinutes: 30, url: "https://leetcode.com/problems/coin-change/" },
      { id: "p-603", title: "Longest Increasing Subsequence", difficulty: "Medium", timeMinutes: 35, url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { id: "p-604", title: "Edit Distance", difficulty: "Hard", timeMinutes: 45, url: "https://leetcode.com/problems/edit-distance/" }
    ],
    proTip: "Never jump to the bottom-up DP table first. Write a brute-force recursive tree, note the overlapping subproblems, and add a memo array."
  },
  system_design: {
    title: "System Design & Distributed Scalability",
    focus: "Load balancers, caching strategies, SQL vs NoSQL, sharding",
    problems: [
      { id: "p-701", title: "Design TinyURL / URL Shortener", difficulty: "Medium", timeMinutes: 45, url: "https://leetcode.com/problems/encode-and-decode-tinyurl/" },
      { id: "p-702", title: "Design Distributed Rate Limiter", difficulty: "Medium", timeMinutes: 45, url: "https://leetcode.com/problemset/all/?search=rate+limiter" },
      { id: "p-703", title: "Design Uber Ride Dispatcher", difficulty: "Hard", timeMinutes: 60, url: "https://leetcode.com/problemset/all/?search=uber" }
    ],
    proTip: "Start every system design answer with: 1. Functional Requirements, 2. Non-Functional (Availability, Latency, Scale), 3. Capacity Estimations (QPS, Storage), 4. High-Level Diagram."
  },
  behavioral_star: {
    title: "Behavioral Mastery & Leadership Mock",
    focus: "STAR format responses, conflict resolution, technical ownership",
    problems: [
      { id: "p-801", title: "Tell me about a challenging bug you debugged in production", difficulty: "Medium", timeMinutes: 30, url: "https://leetcode.com" },
      { id: "p-802", title: "Describe a scenario where you disagreed with a senior engineer", difficulty: "Medium", timeMinutes: 30, url: "https://leetcode.com" },
      { id: "p-803", title: "Full 45-min Mock Interview with Peer Mentor", difficulty: "Hard", timeMinutes: 45, url: "/mock-interviews" }
    ],
    proTip: "Spend 70% of your time on the 'Action' and 'Result' sections of the STAR framework. Quantify your outcome: 'Reduced latency by 42%'."
  }
};

/**
 * Standard baseline schedule generator (backwards-compatible)
 */
export const generateSchedule = (days = 7, level = "intermediate") => {
  return generateCustomRoadmap({ days, level });
};

/**
 * Enhanced customizable schedule generator respecting daily budget, role, and focus areas
 */
export const generateCustomRoadmap = ({
  days = 7,
  level = "intermediate",
  targetCompany = "amazon",
  role = "SDE-1",
  dailyHours = 3,
  focusAreas = []
}) => {
  const dayPlans = [];
  const totalDays = Number(days);
  const targetDailyMinutes = Math.max(60, Number(dailyHours) * 60);

  const topicSequence = [
    "arrays_hashing",
    "two_pointers",
    "linked_lists",
    "trees_bst",
    "graphs_dfs_bfs",
    "dynamic_programming",
    "system_design",
    "behavioral_star"
  ];

  for (let d = 1; d <= totalDays; d++) {
    // Determine revision or mock checkpoint days
    const isMockDay = d === totalDays || (totalDays === 30 && (d === 15 || d === 30));
    const isRevisionDay = (totalDays === 14 && d === 7) || (totalDays === 30 && (d === 8 || d === 22));

    let topicKey;
    if (isMockDay) {
      topicKey = "behavioral_star";
    } else if (isRevisionDay) {
      topicKey = "system_design";
    } else {
      const cycleIdx = (d - 1) % topicSequence.length;
      topicKey = topicSequence[cycleIdx];
    }

    const topicData = MASTER_TOPIC_BANK[topicKey];
    let candidateProblems = [...topicData.problems];

    // Filter by skill level
    if (level === "beginner") {
      candidateProblems = candidateProblems.filter((p) => p.difficulty !== "Hard");
    } else if (level === "advanced") {
      candidateProblems = candidateProblems.filter((p) => p.difficulty !== "Easy");
    }

    // Select tasks that fit approximately within the daily hours budget
    let accumulatedMins = 0;
    const dayProblems = [];

    for (const prob of candidateProblems) {
      if (accumulatedMins + prob.timeMinutes <= targetDailyMinutes + 30 || dayProblems.length === 0) {
        dayProblems.push(prob);
        accumulatedMins += prob.timeMinutes;
      }
      if (dayProblems.length >= 4) break;
    }

    let dayTitle = `Day ${d}: ${topicData.title}`;
    let objective = topicData.focus;

    if (isMockDay) {
      dayTitle = `Day ${d}: Full Mock Interview & Placement Readiness Simulation`;
      objective = `Simulate an end-to-end technical & behavioral interview loop for ${role}.`;
    } else if (isRevisionDay) {
      dayTitle = `Day ${d}: High-Yield Revision & System Architecture Checkpoint`;
      objective = `Review all previously flagged algorithmic patterns and review high-level system design tradeoffs.`;
    }

    dayPlans.push({
      day: d,
      title: dayTitle,
      focus: objective,
      proTip: topicData.proTip,
      problems: dayProblems,
      estimatedTime: `${accumulatedMins} mins`
    });
  }

  return dayPlans;
};
