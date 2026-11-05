export type Seat = "player" | "opponent";
export type Hand = "palm" | "fist" | "cup";
export type CupPosition = Seat | "tray";
export type LossReason = "wrong-hand" | "too-late";

export interface KonpiraOutcome {
  readonly loser: Seat;
  readonly reason: LossReason;
}

/**
 * The rule of the game: with the cup on the tray, tap it with an open palm or
 * take the cup. While the rival holds it, strike with a fist. While you hold
 * it, your only move is to put it back.
 */
export function legalHands(cup: CupPosition, seat: Seat): readonly Hand[] {
  if (cup === "tray") return ["palm", "cup"];
  return cup === seat ? ["cup"] : ["fist"];
}

/** Pure game state: knows nothing about time, screens or narrat. */
export class KonpiraMatch {
  cup: CupPosition = "tray";
  turn: Seat = "opponent";
  beat = 0;
  outcome?: KonpiraOutcome;

  /** Plays a hand for whoever's turn it is. A wrong hand ends the match. */
  play(hand: Hand): void {
    if (!legalHands(this.cup, this.turn).includes(hand)) {
      this.outcome = { loser: this.turn, reason: "wrong-hand" };
      return;
    }
    if (hand === "cup") {
      this.cup = this.cup === "tray" ? this.turn : "tray";
    }
    this.turn = this.turn === "player" ? "opponent" : "player";
    this.beat++;
  }

  /** The current player let the beat pass without playing. */
  miss(): void {
    this.outcome = { loser: this.turn, reason: "too-late" };
  }
}
