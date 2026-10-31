/** What the player sees when they obtain an item. Engine-agnostic. */
export interface RevealedItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly iconUrl: string;
  readonly amount: number;
}

/** Anything able to present an item to the player (DOM card, sound cue, test double...). */
export interface ItemRevealView {
  /** Resolves once the item has been shown and dismissed. */
  show(item: RevealedItem): Promise<void>;
  /** Removes whatever is on screen right now. */
  dismiss(): void;
}
