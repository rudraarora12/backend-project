import { MASTER_TOPIC_BANK } from '../src/data/preparation.js';

const topicSequence = [
  'arrays_hashing',
  'two_pointers',
  'linked_lists',
  'trees_bst',
  'graphs_dfs_bfs',
  'dynamic_programming',
  'system_design',
  'behavioral_star'
];

export function generateRuleBasedRoadmap({ days, level, targetCompany, role, dailyHours, focusAreas = [] }) {
  const dailyBudget = dailyHours * 60;
  return Array.from({ length: days }, (_, index) => {
    const dayNumber = index + 1;
    const isMockDay = dayNumber === days || (days === 30 && dayNumber === 15);
    const isRevisionDay = (days === 14 && dayNumber === 7) || (days === 30 && [8, 22].includes(dayNumber));
    const defaultTopic = isMockDay
      ? 'behavioral_star'
      : isRevisionDay
        ? 'system_design'
        : topicSequence[index % topicSequence.length];
    const focusMatch = focusAreas.length
      ? Object.entries(MASTER_TOPIC_BANK).find(([, topic]) =>
        focusAreas.some((focus) => topic.title.toLowerCase().includes(focus.toLowerCase()))
      )?.[0]
      : null;
    const topic = MASTER_TOPIC_BANK[isMockDay || isRevisionDay ? defaultTopic : focusMatch || defaultTopic];
    const problems = topic.problems.filter((problem) => (
      level === 'beginner' ? problem.difficulty !== 'Hard'
        : level === 'advanced' ? problem.difficulty !== 'Easy'
          : true
    ));

    let remaining = dailyBudget;
    const tasks = [];
    for (const problem of problems) {
      if (tasks.length === 4) break;
      if (problem.timeMinutes <= remaining || tasks.length === 0) {
        tasks.push(problem);
        remaining -= problem.timeMinutes;
      }
    }

    const title = isMockDay
      ? `Day ${dayNumber}: Full Mock Interview & Placement Readiness Simulation`
      : isRevisionDay
        ? `Day ${dayNumber}: High-Yield Revision & System Architecture Checkpoint`
        : `Day ${dayNumber}: ${topic.title}`;
    const focus = isMockDay
      ? `Simulate a technical and behavioral interview loop for ${role} at ${targetCompany}.`
      : isRevisionDay
        ? 'Review flagged algorithmic patterns and high-level system design tradeoffs.'
        : topic.focus;

    return {
      dayNumber,
      title,
      focus,
      proTip: topic.proTip,
      estimatedMinutes: tasks.reduce((sum, task) => sum + task.timeMinutes, 0),
      tasks: tasks.map((task) => ({
        title: task.title,
        difficulty: task.difficulty,
        timeMinutes: task.timeMinutes,
        resourceUrl: task.url
      }))
    };
  });
}
