import { CommandPlugin } from "narrat";
import {
  KONPIRA_DIFFICULTIES,
  type KonpiraDifficultyId,
} from "./KonpiraDifficulty";
import type { KonpiraGame } from "./KonpiraGame";

interface KonpiraArgs {
  difficulty?: string;
}

function isDifficulty(id: string): id is KonpiraDifficultyId {
  return id in KONPIRA_DIFFICULTIES;
}

/**
 * Narrat script usage:
 *   if (konpira_fune easy):     -> plays a match, returns true if the player won
 * Difficulty is easy, normal (default) or hard.
 */
export function createKonpiraCommand(
  game: KonpiraGame,
): CommandPlugin<KonpiraArgs> {
  return CommandPlugin.FromOptions<KonpiraArgs>({
    keyword: "konpira_fune",
    argTypes: [{ name: "difficulty", type: "string", optional: true }],
    runner: async (cmd) => {
      const id = cmd.options.difficulty ?? "normal";
      if (!isDifficulty(id)) {
        const valid = Object.keys(KONPIRA_DIFFICULTIES).join(", ");
        throw new Error(
          `konpira_fune: unknown difficulty "${id}". Use: ${valid}`,
        );
      }
      return game.play(KONPIRA_DIFFICULTIES[id]);
    },
  });
}
