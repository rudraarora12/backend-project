export const TRACK_CONFIGS = {
  amazon: {
    name: "Amazon SDE Track",
    companySlug: "amazon",
    accentColor: "#FF9900",
    description: "Focus on Trees, Dynamic Programming, and Amazon's 16 Leadership Principles.",
    targetRole: "SDE-1 / SDE Intern",
    estimatedWeeks: 4,
    metrics: {
      totalProblems: 45,
      completedProblems: 28,
      readinessScore: 78,
      dsaMastery: 82,
      lpMastery: 75,
      lldMastery: 65
    },
    milestones: [
      { id: "m1", title: "Amazon OA Assessment Simulation", status: "completed" },
      { id: "m2", title: "Top 30 Most Frequent Amazon Questions", status: "completed" },
      { id: "m3", title: "Leadership Principles STAR Drill (16 LPs)", status: "in_progress" },
      { id: "m4", title: "Live Bar Raiser Mock Interview", status: "pending" }
    ]
  },
  google: {
    name: "Google SWE Track",
    companySlug: "google",
    accentColor: "#4285F4",
    description: "Deep dive into Segment Trees, advanced Graphs, and zero-hint algorithmic optimization.",
    targetRole: "Software Engineer (L3)",
    estimatedWeeks: 6,
    metrics: {
      totalProblems: 60,
      completedProblems: 34,
      readinessScore: 68,
      dsaMastery: 86,
      lpMastery: 60,
      lldMastery: 50
    },
    milestones: [
      { id: "m1", title: "Google OA Matrix & Graph Screening", status: "completed" },
      { id: "m2", title: "Google Hard 40 Problem Sprint", status: "in_progress" },
      { id: "m3", title: "Time/Space Complexity Mathematical Proofs", status: "in_progress" },
      { id: "m4", title: "Googleyness & Ethics Mock Session", status: "pending" }
    ]
  },
  microsoft: {
    name: "Microsoft SWE Track",
    companySlug: "microsoft",
    accentColor: "#00A4EF",
    description: "Balanced focus on Low Level Design, Operating Systems internals, and Core CS.",
    targetRole: "Software Engineer",
    estimatedWeeks: 4,
    metrics: {
      totalProblems: 40,
      completedProblems: 31,
      readinessScore: 84,
      dsaMastery: 88,
      lpMastery: 80,
      lldMastery: 85
    },
    milestones: [
      { id: "m1", title: "Core CS: Operating Systems & Virtual Memory", status: "completed" },
      { id: "m2", title: "Low Level Design: Parking Lot & Elevator", status: "completed" },
      { id: "m3", title: "Microsoft Most Tagged Trees & Lists", status: "completed" },
      { id: "m4", title: "As-Appropriate (AA) Leadership Panel", status: "in_progress" }
    ]
  }
};

export const DEFAULT_PRACTICE_CHALLENGES = [
  {
    id: "pc-1",
    title: "LRU Cache",
    track: "amazon",
    category: "Data Structures",
    difficulty: "Medium",
    status: "Solved",
    frequency: "95%",
    link: "https://leetcode.com/problems/lru-cache/"
  },
  {
    id: "pc-2",
    title: "Trapping Rain Water",
    track: "google",
    category: "Algorithms",
    difficulty: "Hard",
    status: "Solved",
    frequency: "91%",
    link: "https://leetcode.com/problems/trapping-rain-water/"
  },
  {
    id: "pc-3",
    title: "Course Schedule II",
    track: "amazon",
    category: "Graphs",
    difficulty: "Medium",
    status: "In Progress",
    frequency: "88%",
    link: "https://leetcode.com/problems/course-schedule-ii/"
  },
  {
    id: "pc-4",
    title: "Serialize & Deserialize Binary Tree",
    track: "microsoft",
    category: "Trees",
    difficulty: "Hard",
    status: "Todo",
    frequency: "84%",
    link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
  },
  {
    id: "pc-5",
    title: "Design Parking Lot System (LLD)",
    track: "microsoft",
    category: "Design",
    difficulty: "Medium",
    status: "Solved",
    frequency: "89%",
    link: "https://leetcode.com/problems/design-parking-system/"
  },
  {
    id: "pc-6",
    title: "Word Ladder I & II",
    track: "google",
    category: "BFS & Graphs",
    difficulty: "Hard",
    status: "In Progress",
    frequency: "79%",
    link: "https://leetcode.com/problems/word-ladder/"
  },
  {
    id: "pc-7",
    title: "Subarray Sum Equals K",
    track: "amazon",
    category: "Arrays & Hash",
    difficulty: "Medium",
    status: "Solved",
    frequency: "92%",
    link: "https://leetcode.com/problems/subarray-sum-equals-k/"
  },
  {
    id: "pc-8",
    title: "Alien Dictionary",
    track: "google",
    category: "Topological Sort",
    difficulty: "Hard",
    status: "Todo",
    frequency: "77%",
    link: "https://leetcode.com/problems/alien-dictionary/"
  }
];

export const generateHeatmapData = () => {
  const weeks = [];
  const daysOfWeek = 7;
  const totalWeeks = 52;
  const now = new Date();

  for (let w = 0; w < totalWeeks; w++) {
    const days = [];
    for (let d = 0; d < daysOfWeek; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - ((totalWeeks - 1 - w) * 7 + (6 - d)));
      
      const seed = (w * 7 + d * 13) % 100;
      let count = 0;
      if (seed > 65) count = Math.floor((seed % 6) + 1);
      if (w > 46 && seed > 40) count = Math.floor((seed % 8) + 2);

      days.push({
        date: date.toISOString().split("T")[0],
        count: count,
        level: count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4
      });
    }
    weeks.push(days);
  }

  return weeks;
};
