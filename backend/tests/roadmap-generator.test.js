import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRuleBasedRoadmap } from '../roadmap-generator.js';

for (const days of [7, 14, 30]) {
  test(`generates a complete ${days}-day roadmap`, () => {
    const roadmap = generateRuleBasedRoadmap({
      days,
      level: 'intermediate',
      targetCompany: 'Example',
      role: 'Software Engineer',
      dailyHours: 3,
      focusAreas: ['DSA']
    });
    assert.equal(roadmap.length, days);
    assert.deepEqual(roadmap.map(({ dayNumber }) => dayNumber), Array.from({ length: days }, (_, i) => i + 1));
    assert.ok(roadmap.every(({ title, focus, tasks }) => title.length > 0 && focus.length > 0 && tasks.length > 0));
    assert.ok(roadmap.every(({ tasks }) => tasks.length <= 4));
  });
}

test('respects skill-level difficulty filtering', () => {
  const beginner = generateRuleBasedRoadmap({
    days: 7, level: 'beginner', targetCompany: 'Example', role: 'Engineer', dailyHours: 2
  });
  assert.ok(beginner.flatMap(({ tasks }) => tasks).every(({ difficulty }) => difficulty !== 'Hard'));
});
