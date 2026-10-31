import type { ItemRevealView, RevealedItem } from "./ItemRevealView";

/**
 * Shows obtained items one after another, so two add_item in a row
 * never overlap on screen.
 */
export class ItemRevealQueue {
  private readonly pending: RevealedItem[] = [];
  private running = false;

  constructor(private readonly view: ItemRevealView) {}

  enqueue(item: RevealedItem): void {
    this.pending.push(item);
    if (!this.running) {
      void this.drain();
    }
  }

  /** Drops every pending item and hides the current one (e.g. when leaving the game). */
  clear(): void {
    this.pending.length = 0;
    this.view.dismiss();
  }

  private async drain(): Promise<void> {
    this.running = true;
    try {
      let next: RevealedItem | undefined;
      while ((next = this.pending.shift())) {
        await this.view.show(next);
      }
    } finally {
      this.running = false;
    }
  }
}
