import type { NarratPluginObject } from "narrat";
import { USE_STEAM } from "../../constants";
import { VisitTracker } from "../visits/VisitTracker";
import { VisitsPlugin } from "../visits/VisitsPlugin";
import { SteamPlugin } from "./SteamPlugin";

/** Every engine extension the game uses. Add new mechanics here, nowhere else. */
export function createPlugins(): NarratPluginObject<unknown>[] {
  const plugins: NarratPluginObject<unknown>[] = [
    new VisitsPlugin(new VisitTracker()),
  ];
  if (USE_STEAM) {
    plugins.push(new SteamPlugin());
  }
  return plugins;
}
