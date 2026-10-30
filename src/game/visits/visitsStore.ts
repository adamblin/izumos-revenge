import { defineStore } from "pinia";
import type { VisitSnapshot, VisitTracker } from "./VisitTracker";

/**
 * Persists the tracker in save files.
 * Narrat 4.1 only serialises custom stores: the plugin-level save()/load() hooks crash
 * because the save object never gets its "plugins" field.
 */
export function defineVisitsStore(tracker: VisitTracker) {
  return defineStore("visits", {
    actions: {
      save: (): VisitSnapshot => tracker.snapshot(),
      load: (snapshot?: VisitSnapshot) => tracker.restore(snapshot ?? []),
      reset: () => tracker.clear(),
    },
  });
}
