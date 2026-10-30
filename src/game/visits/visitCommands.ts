import { CommandPlugin } from "narrat";
import type { VisitRegistry } from "./VisitTracker";

interface LocationArgs {
  locationId: string;
}

const LOCATION_ARG = [{ name: "locationId", type: "string" as const }];

/**
 * Narrat script usage:
 *   mark_visited ch01_room          -> command, changes state
 *   if (visited? ch01_room):        -> query, returns true/false
 */
export function createVisitCommands(
  visits: VisitRegistry,
): CommandPlugin<LocationArgs>[] {
  const markVisited = CommandPlugin.FromOptions<LocationArgs>({
    keyword: "mark_visited",
    argTypes: LOCATION_ARG,
    runner: async (cmd) => visits.markVisited(cmd.options.locationId),
  });

  const visited = CommandPlugin.FromOptions<LocationArgs>({
    keyword: "visited?",
    argTypes: LOCATION_ARG,
    runner: async (cmd) => visits.hasVisited(cmd.options.locationId),
  });

  return [markVisited, visited];
}
