import { NarratPlugin, useAudio, type CommandPlugin } from "narrat";
import { DomKonpiraView } from "./DomKonpiraView";
import { KonpiraGame } from "./KonpiraGame";
import { createKonpiraCommand } from "./konpiraCommands";
import { KONPIRA_TEXTS } from "./konpiraTexts";
import { WebAudioKonpiraSound } from "./WebAudioKonpiraSound";

/** Adapter between the minigame and narrat: wires its parts and exposes the command. */
export class KonpiraPlugin extends NarratPlugin<unknown> {
  pluginId = "konpira";
  customCommands: CommandPlugin<unknown>[];

  constructor() {
    super();
    const sound = new WebAudioKonpiraSound(() => {
      const audio = useAudio();
      return audio.getMasterVolume() * audio.getModeVolume("sound");
    });
    const game = new KonpiraGame(
      new DomKonpiraView(KONPIRA_TEXTS),
      sound,
      KONPIRA_TEXTS.lyrics,
    );
    this.customCommands = [
      createKonpiraCommand(game) as CommandPlugin<unknown>,
    ];
  }
}
