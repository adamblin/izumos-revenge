import type { CupPosition, Hand, KonpiraOutcome, Seat } from "./KonpiraMatch";

/** Everything the game loop needs from the screen. */
export interface KonpiraView {
  /** Resolves when the player starts the match. */
  open(onHand: (hand: Hand) => void): Promise<void>;
  showHand(seat: Seat, hand: Hand, cup: CupPosition, beatMs: number): void;
  /** Marks the player's turn and shows the time left to answer. */
  showPlayerTurn(beatMs: number): void;
  showLyric(line: string): void;
  /** Resolves when the player dismisses the result. */
  showResult(outcome: KonpiraOutcome): Promise<void>;
  close(): void;
}

/** Short sound for each hand, or for losing the match. */
export interface KonpiraSound {
  play(cue: Hand | "fail"): void;
}
