import { beatDuration, type KonpiraDifficulty } from "./KonpiraDifficulty";
import { KonpiraMatch, type Hand, type KonpiraOutcome } from "./KonpiraMatch";
import { KonpiraOpponent } from "./KonpiraOpponent";
import type { KonpiraSound, KonpiraView } from "./KonpiraView";

const COUNT_IN_MS = 800;
const BEATS_PER_LYRIC = 4;
/** Lets the player see the final hand before the result covers it. */
const RESULT_DELAY_MS = 900;
/** A press this close to the end of the rival's beat counts for the player's beat. */
const EARLY_PRESS_WINDOW = 0.35;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The rhythm loop: asks the match what is legal and tells the view what to show. */
export class KonpiraGame {
  private answer?: (hand: Hand | undefined) => void;
  private earlyPress?: Hand;
  private earlyPressFrom = Infinity;

  constructor(
    private readonly view: KonpiraView,
    private readonly sound: KonpiraSound,
    private readonly lyrics: readonly string[],
  ) {}

  /** Plays one match to the end. Resolves with true if the player won. */
  async play(difficulty: KonpiraDifficulty): Promise<boolean> {
    await this.view.open((hand) => this.onPress(hand));
    try {
      const outcome = await this.runMatch(difficulty);
      if (outcome.loser === "player") this.sound.play("fail");
      await sleep(RESULT_DELAY_MS);
      await this.view.showResult(outcome);
      return outcome.loser === "opponent";
    } finally {
      this.view.close();
    }
  }

  private async runMatch(
    difficulty: KonpiraDifficulty,
  ): Promise<KonpiraOutcome> {
    const match = new KonpiraMatch();
    const opponent = new KonpiraOpponent(difficulty);
    await sleep(COUNT_IN_MS);

    while (!match.outcome) {
      const beatMs = beatDuration(difficulty, match.beat);
      if (match.beat % BEATS_PER_LYRIC === 0) {
        const verse = match.beat / BEATS_PER_LYRIC;
        this.view.showLyric(this.lyrics[verse % this.lyrics.length]);
      }
      if (match.turn === "opponent") {
        await this.opponentBeat(match, opponent, beatMs);
      } else {
        await this.playerBeat(match, beatMs);
      }
    }
    return match.outcome;
  }

  private async opponentBeat(
    match: KonpiraMatch,
    opponent: KonpiraOpponent,
    beatMs: number,
  ): Promise<void> {
    const hand = opponent.choose(match.cup, match.beat);
    match.play(hand);
    this.sound.play(hand);
    this.view.showHand("opponent", hand, match.cup, beatMs);
    if (match.outcome) return;

    this.earlyPressFrom = performance.now() + beatMs * (1 - EARLY_PRESS_WINDOW);
    await sleep(beatMs);
  }

  private async playerBeat(match: KonpiraMatch, beatMs: number): Promise<void> {
    const started = performance.now();
    this.view.showPlayerTurn(beatMs);

    const hand = await this.waitForHand(beatMs);
    if (!hand) {
      match.miss();
      return;
    }
    match.play(hand);
    this.sound.play(hand);
    this.view.showHand("player", hand, match.cup, beatMs);
    if (match.outcome) return;

    // An early answer still waits for the end of the beat, to keep the rhythm
    await sleep(beatMs - (performance.now() - started));
  }

  private waitForHand(timeoutMs: number): Promise<Hand | undefined> {
    const early = this.earlyPress;
    this.earlyPress = undefined;
    this.earlyPressFrom = Infinity;
    if (early) return Promise.resolve(early);

    return new Promise((resolve) => {
      const timer = setTimeout(() => this.settle(undefined), timeoutMs);
      this.answer = (hand) => {
        clearTimeout(timer);
        resolve(hand);
      };
    });
  }

  private settle(hand: Hand | undefined): void {
    const answer = this.answer;
    this.answer = undefined;
    answer?.(hand);
  }

  private onPress(hand: Hand): void {
    if (this.answer) {
      this.settle(hand);
    } else if (performance.now() >= this.earlyPressFrom) {
      this.earlyPress ??= hand;
    }
  }
}
