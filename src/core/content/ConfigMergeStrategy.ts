import type { NarratYaml } from "./ContentModule";

export type PlainObject = Record<string, unknown>;

/** Combines every YAML fragment of one config section into a single object. */
export interface ConfigMergeStrategy {
  merge(section: string, fragments: readonly NarratYaml[]): PlainObject;
}
