import { defineContentModule } from "@/core/content/ContentModule";
import audio from "./config/audio.yaml";
import buttons from "./config/buttons.yaml";
import items from "./config/items.yaml";
import quests from "./config/quests.yaml";
import screens from "./config/screens.yaml";
import intro from "./scripts/intro.narrat";
import room from "./scripts/room.narrat";

/** Chapter 1 - Prologue: Izumo wakes up locked in a room. */
export default defineContentModule({
  id: "ch01-prologue",
  scripts: [intro, room],
  config: {
    audio: [audio],
    buttons: [buttons],
    items: [items],
    quests: [quests],
    screens: [screens],
  },
});
