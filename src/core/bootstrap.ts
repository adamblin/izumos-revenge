import { registerPlugin, startApp, type NarratPluginObject } from "narrat";
import { ContentAssembler } from "./content/ContentAssembler";
import type { ContentModule } from "./content/ContentModule";
import { StrictDeepMerge } from "./content/StrictDeepMerge";

export interface GameManifest {
  debug: boolean;
  defaultLanguage: string;
  translations: Record<string, unknown>;
  modules: readonly ContentModule[];
  plugins: readonly NarratPluginObject<unknown>[];
}

/** Single entry point that wires content and plugins into narrat. */
export function bootstrap(manifest: GameManifest): void {
  const { scripts, config } = new ContentAssembler(
    new StrictDeepMerge(),
  ).assemble(manifest.modules);

  manifest.plugins.forEach((plugin) => registerPlugin(plugin));

  startApp({
    debug: manifest.debug,
    logging: false,
    scripts,
    config,
    localization: {
      debug: manifest.debug,
      lng: manifest.defaultLanguage,
      resources: manifest.translations,
    },
  });
}
