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
      { id: "p-803", title: "Full 45-min Mock Interview with Peer Mentor", difficulty: "Hard", timeMinutes: 45, url: "/interview-connect" }
    ],
    proTip: "Spend 70% of your time on the 'Action' and 'Result' sections of the STAR framework. Quantify your outcome: 'Reduced latency by 42%'."
  }
};

export const generateSchedule = (days = 7, level = "intermediate") => {
  const dayPlans = [];
  const totalDays = Number(days);

  const topicKeys = [
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
    let topicKey;
    if (totalDays === 7) {
      const map7 = [
        "arrays_hashing",
        "two_pointers",
        "linked_lists",
        "trees_bst",
        "graphs_dfs_bfs",
        "dynamic_programming",
        "behavioral_star"
      ];
      topicKey = map7[d - 1] || "system_design";
    } else if (totalDays === 14) {
      const map14 = [
        "arrays_hashing",
        "arrays_hashing",
        "two_pointers",
        "two_pointers",
        "linked_lists",
        "trees_bst",
        "trees_bst",
        "graphs_dfs_bfs",
        "graphs_dfs_bfs",
        "dynamic_programming",
        "dynamic_programming",
        "system_design",
        "system_design",
        "behavioral_star"
      ];
      topicKey = map14[d - 1] || "trees_bst";
    } else {
      const cycleIndex = (d - 1) % topicKeys.length;
      topicKey = topicKeys[cycleIndex];
    }

    const topicData = MASTER_TOPIC_BANK[topicKey];
    let selectedProblems = topicData.problems;

    if (level === "beginner") {
      selectedProblems = topicData.problems.filter((p) => p.difficulty !== "Hard").slice(0, 2);
    } else if (level === "advanced") {
      selectedProblems = topicData.problems.filter((p) => p.difficulty !== "Easy");
    } else {
      selectedProblems = topicData.problems.slice(0, 3);
    }

    dayPlans.push({
      day: d,
      title: `Day ${d}: ${topicData.title}`,
      focus: topicData.focus,
      proTip: topicData.proTip,
      problems: selectedProblems,
      estimatedTime: `${selectedProblems.reduce((acc, curr) => acc + curr.timeMinutes, 0)} mins`
    });
  }

  return dayPlans;
};
