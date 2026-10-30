import { NarratPlugin, type CommandPlugin, type CustomStores } from "narrat";
import { createVisitCommands } from "./visitCommands";
import { defineVisitsStore } from "./visitsStore";
import type { VisitTracker } from "./VisitTracker";

/** Adapter between the VisitTracker and narrat: exposes its commands and persists it in saves. */
export class VisitsPlugin extends NarratPlugin<unknown> {
  pluginId = "visits";
  customCommands: CommandPlugin<unknown>[];
  customStores: CustomStores;

  constructor(private readonly tracker: VisitTracker) {
    super();
    this.customCommands = createVisitCommands(
      tracker,
    ) as CommandPlugin<unknown>[];
    this.customStores = { visits: defineVisitsStore(tracker) };
  }

  /** Called by narrat on "new game" and before loading a save. */
  reset(): void {
    this.tracker.clear();
  }
}
