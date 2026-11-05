import type { KonpiraDifficulty } from "./KonpiraDifficulty";
import { legalHands, type CupPosition, type Hand } from "./KonpiraMatch";

const ALL_HANDS: readonly Hand[] = ["palm", "fist", "cup"];

/** Plays correctly at first and gets more likely to slip as the song goes on. */
export class KonpiraOpponent {
  constructor(
    private readonly difficulty: KonpiraDifficulty,
    private readonly random: () => number = Math.random,
  ) {}

  choose(cup: CupPosition, beat: number): Hand {
    const legal = legalHands(cup, "opponent");
    if (this.random() < this.errorChance(beat)) {
      return ALL_HANDS.find((hand) => !legal.includes(hand))!;
    }
    if (cup === "tray") {
      return this.random() < this.difficulty.takeChance ? "cup" : "palm";
    }
    return legal[0];
  }

  private errorChance(beat: number): number {
    return (beat - this.difficulty.safeBeats) * this.difficulty.errorGrowth;
  }
}
