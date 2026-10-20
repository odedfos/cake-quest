// Small sound effects made with the Web Audio API, so there are no audio files to load.

let ctx: AudioContext | undefined;

function audio(): AudioContext | undefined {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return undefined;
  ctx ??= new AudioContext();
  return ctx;
}

// A short rising two-note chime for a right answer.
export function playSuccess(): void {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime;
  [523.25, 783.99].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = start + i * 0.12;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}
