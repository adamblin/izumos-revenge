import type { ModuleConfigInput, NarratScript } from "narrat";
// narrat does not re-export this type from its entry point.
import type { NarratYaml } from "narrat/dist/types/app-types";

export type { NarratYaml };

/** Any of the config sections narrat understands (screens, buttons, characters...). */
export type ConfigKey = keyof ModuleConfigInput;

/** Config files grouped by section. Each section can be split across several YAML files. */
export type ConfigFragments = Partial<Record<ConfigKey, readonly NarratYaml[]>>;

/**
 * A self-contained piece of game content (the global setup, the cast, a chapter...).
 * Modules never reference each other in code: they are only combined by the ContentAssembler.
 */
export interface ContentModule {
  readonly id: string;
  readonly scripts?: readonly NarratScript[];
  readonly config?: ConfigFragments;
}

/** Typed factory so every module declaration gets autocompletion and validation. */
export function defineContentModule(module: ContentModule): ContentModule {
  return module;
}
