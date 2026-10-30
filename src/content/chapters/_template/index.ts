// TEMPLATE - copy this folder, rename it (e.g. ch02-harbour) and replace every "chXX".
// Then register the new module in src/content/index.ts.
import { defineContentModule } from "@/core/content/ContentModule";
import audio from "./config/audio.yaml";
import buttons from "./config/buttons.yaml";
import items from "./config/items.yaml";
import quests from "./config/quests.yaml";
import screens from "./config/screens.yaml";
import start from "./scripts/start.narrat";

/** Chapter XX - <title>: <one line summary>. */
export default defineContentModule({
  id: "chXX-name",
  scripts: [start],
  config: {
    audio: [audio],
    buttons: [buttons],
    items: [items],
    quests: [quests],
    screens: [screens],
  },
});
