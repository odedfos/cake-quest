// Walking a character across a scene. Positions are the character's `left`, in percent of
// the scene's width.

import { useEffect, useRef, useState } from 'preact/hooks';

// Scene widths per second; a walk across the whole kitchen takes about four seconds.
export const WALK_SPEED = 24;

export type Leg = { to: number; ms: number };

// Splits a path into legs, skipping points the character is already at.
export function planWalk(from: number, path: number[], speed = WALK_SPEED): Leg[] {
  const legs: Leg[] = [];
  let at = from;
  for (const to of path) {
    const distance = Math.abs(to - at);
    if (distance < 0.5) continue;
    legs.push({ to, ms: Math.round((distance / speed) * 1000) });
    at = to;
  }
  return legs;
}

export type Walk = {
  x: number;
  // Duration of the current leg, for the CSS transition.
  ms: number;
  // -1 walking left, 1 walking right, 0 standing.
  dir: number;
  // Index of the leg being walked, or -1 when standing.
  leg: number;
};

// Walks through `path` whenever it changes, one leg after another.
export function useWalk(path: number[], start: number): Walk {
  const [walk, setWalk] = useState<Walk>({ x: start, ms: 0, dir: 0, leg: -1 });
  const at = useRef(start);
  const key = path.join(',');

  useEffect(() => {
    const legs = planWalk(at.current, path);
    const timers: ReturnType<typeof setTimeout>[] = [];
    // A short pause first, so the browser has drawn the start position to walk from.
    let t = 40;
    let from = at.current;
    legs.forEach((leg, i) => {
      const dir = Math.sign(leg.to - from);
      timers.push(setTimeout(() => setWalk({ x: leg.to, ms: leg.ms, dir, leg: i }), t));
      t += leg.ms;
      from = leg.to;
    });
    if (legs.length) timers.push(setTimeout(() => setWalk((w) => ({ ...w, dir: 0, leg: -1 })), t));
    at.current = from;
    return () => timers.forEach(clearTimeout);
  }, [key]);

  return walk;
}
