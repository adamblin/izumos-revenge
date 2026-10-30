import type { ConfigMergeStrategy, PlainObject } from "./ConfigMergeStrategy";
import type { NarratYaml } from "./ContentModule";

export class ConfigConflictError extends Error {
  constructor(path: string, firstFile: string, secondFile: string) {
    super(
      `Config conflict: "${path}" is defined in both "${firstFile}" and "${secondFile}". ` +
        `IDs must be unique across the whole game (prefix them with the chapter, e.g. ch01_).`,
    );
    this.name = "ConfigConflictError";
  }
}

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep merge rules:
 * - objects are merged key by key,
 * - arrays are concatenated,
 * - defining the same value twice is an error (it almost always means a duplicated ID).
 */
export class StrictDeepMerge implements ConfigMergeStrategy {
  merge(section: string, fragments: readonly NarratYaml[]): PlainObject {
    const result: PlainObject = {};
    const origins = new Map<string, string>();
    for (const fragment of fragments) {
      this.mergeInto(
        result,
        fragment.code ?? {},
        section,
        fragment.fileName,
        origins,
      );
    }
    return result;
  }

  private mergeInto(
    target: PlainObject,
    source: PlainObject,
    path: string,
    fileName: string,
    origins: Map<string, string>,
  ): void {
    for (const [key, value] of Object.entries(source)) {
      const keyPath = `${path}.${key}`;
      const existing = target[key];

      if (isPlainObject(existing) && isPlainObject(value)) {
        this.mergeInto(existing, value, keyPath, fileName, origins);
      } else if (Array.isArray(existing) && Array.isArray(value)) {
        target[key] = [...existing, ...value];
      } else if (key in target) {
        throw new ConfigConflictError(
          keyPath,
          origins.get(keyPath) ?? "another file",
          fileName,
        );
      } else if (isPlainObject(value)) {
        // Copy instead of assigning so later merges never mutate the imported YAML module.
        const copy: PlainObject = {};
        target[key] = copy;
        origins.set(keyPath, fileName);
        this.mergeInto(copy, value, keyPath, fileName, origins);
      } else {
        target[key] = Array.isArray(value) ? [...value] : value;
        origins.set(keyPath, fileName);
      }
    }
  }
}
