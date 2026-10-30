import type { ContentModule } from "@/core/content/ContentModule";
import characters from "./characters";
import prologue from "./chapters/ch01-prologue";
import global from "./global";

/**
 * Every piece of content in the game.
 * To add a chapter: create its folder under chapters/ and add it to this list.
 */
export const contentModules: readonly ContentModule[] = [
  global,
  characters,
  prologue,
];
