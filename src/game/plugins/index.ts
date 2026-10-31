import type { NarratPluginObject } from "narrat";
import { USE_STEAM } from "../../constants";
import { SingleLineDialogPlugin } from "../dialog/SingleLineDialogPlugin";
import { DomItemRevealView } from "../item-reveal/DomItemRevealView";
import { ItemRevealPlugin } from "../item-reveal/ItemRevealPlugin";
import { ItemRevealQueue } from "../item-reveal/ItemRevealQueue";
import { VisitTracker } from "../visits/VisitTracker";
import { VisitsPlugin } from "../visits/VisitsPlugin";
import { SteamPlugin } from "./SteamPlugin";

/** Every engine extension the game uses. Add new mechanics here, nowhere else. */
export function createPlugins(): NarratPluginObject<unknown>[] {
  const plugins: NarratPluginObject<unknown>[] = [
    new VisitsPlugin(new VisitTracker()),
    new SingleLineDialogPlugin(),
    new ItemRevealPlugin(
      new ItemRevealQueue(
        new DomItemRevealView({ label: "Item obtained", durationMs: 3500 }),
      ),
    ),
  ];
  if (USE_STEAM) {
    plugins.push(new SteamPlugin());
  }
  return plugins;
}
