import { describe, expect, it } from 'vitest';
import { planWalk } from './walk';

describe('planWalk', () => {
  it('times each leg by its distance', () => {
    expect(planWalk(0, [24, 12], 24)).toEqual([
      { to: 24, ms: 1000 },
      { to: 12, ms: 500 },
    ]);
  });

  it('skips points the character is already at', () => {
    expect(planWalk(20, [20, 20.2], 24)).toEqual([]);
  });
});
