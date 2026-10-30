import { defineContentModule } from "@/core/content/ContentModule";
import audio from "./config/audio.yaml";
import common from "./config/common.yaml";
import fonts from "./config/fonts.yaml";
import items from "./config/items.yaml";
import localization from "./config/localization.yaml";
import quests from "./config/quests.yaml";
import screens from "./config/screens.yaml";
import skillChecks from "./config/skillchecks.yaml";
import skills from "./config/skills.yaml";
import tooltips from "./config/tooltips.yaml";
import main from "./scripts/main.narrat";

/** Engine-wide settings and the game entry point. */
export default defineContentModule({
  id: "global",
  scripts: [main],
  config: {
    audio: [audio],
    common: [common],
    fonts: [fonts],
    items: [items],
    localization: [localization],
    quests: [quests],
    screens: [screens],
    skillChecks: [skillChecks],
    skills: [skills],
    tooltips: [tooltips],
  },
});
