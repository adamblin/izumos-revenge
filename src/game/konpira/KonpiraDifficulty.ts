export interface KonpiraDifficulty {
  /** Time per beat at the start, the fastest it can get, and how fast it speeds up. */
  readonly startBeatMs: number;
  readonly minBeatMs: number;
  readonly speedUp: number;
  /** How often the rival takes the cup when it is free (0-1). */
  readonly takeChance: number;
  /** The rival never fails before this beat; afterwards the risk grows each beat. */
  readonly safeBeats: number;
  readonly errorGrowth: number;
}

export const KONPIRA_DIFFICULTIES = {
  easy: {
    startBeatMs: 1100,
    minBeatMs: 600,
    speedUp: 0.98,
    takeChance: 0.25,
    safeBeats: 14,
    errorGrowth: 0.03,
  },
  normal: {
    startBeatMs: 950,
    minBeatMs: 480,
    speedUp: 0.97,
    takeChance: 0.3,
    safeBeats: 20,
    errorGrowth: 0.025,
  },
  hard: {
    startBeatMs: 800,
    minBeatMs: 380,
    speedUp: 0.96,
    takeChance: 0.35,
    safeBeats: 30,
    errorGrowth: 0.02,
  },
} as const satisfies Record<string, KonpiraDifficulty>;

export type KonpiraDifficultyId = keyof typeof KONPIRA_DIFFICULTIES;

export function beatDuration(
  difficulty: KonpiraDifficulty,
  beat: number,
): number {
  return Math.max(
    difficulty.minBeatMs,
    difficulty.startBeatMs * difficulty.speedUp ** beat,
  );
}
