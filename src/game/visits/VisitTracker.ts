/** What the narrat commands need to know about visits (kept small on purpose). */
export interface VisitRegistry {
  markVisited(locationId: string): void;
  hasVisited(locationId: string): boolean;
}

export type VisitSnapshot = string[];

/** Pure domain object: remembers which locations the player has already entered. */
export class VisitTracker implements VisitRegistry {
  private visited = new Set<string>();

  markVisited(locationId: string): void {
    this.visited.add(locationId);
  }

  hasVisited(locationId: string): boolean {
    return this.visited.has(locationId);
  }

  snapshot(): VisitSnapshot {
    return [...this.visited];
  }

  restore(snapshot: VisitSnapshot): void {
    this.visited = new Set(snapshot);
  }

  clear(): void {
    this.visited.clear();
  }
}
