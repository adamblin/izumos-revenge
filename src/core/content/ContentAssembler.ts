import type { ModuleConfigInput, NarratScript } from "narrat";
import type { ConfigKey, ContentModule, NarratYaml } from "./ContentModule";
import type { ConfigMergeStrategy } from "./ConfigMergeStrategy";

export interface AssembledContent {
  scripts: NarratScript[];
  config: ModuleConfigInput;
}

const REQUIRED_SECTIONS: readonly ConfigKey[] = ["common", "screens"];

/** Turns the list of content modules into the scripts + config that narrat expects. */
export class ContentAssembler {
  constructor(private readonly mergeStrategy: ConfigMergeStrategy) {}

  assemble(modules: readonly ContentModule[]): AssembledContent {
    this.assertUniqueIds(modules);
    return {
      scripts: modules.flatMap((module) => module.scripts ?? []),
      config: this.assembleConfig(modules),
    };
  }

  private assertUniqueIds(modules: readonly ContentModule[]): void {
    const seen = new Set<string>();
    for (const { id } of modules) {
      if (seen.has(id)) {
        throw new Error(`Content module "${id}" is registered twice.`);
      }
      seen.add(id);
    }
  }

  private assembleConfig(modules: readonly ContentModule[]): ModuleConfigInput {
    const fragmentsBySection = this.groupFragmentsBySection(modules);
    this.assertRequiredSections(fragmentsBySection);

    const config: Partial<Record<ConfigKey, NarratYaml>> = {};
    for (const [section, fragments] of fragmentsBySection) {
      config[section] = {
        type: "yaml",
        id: `merged:${section}`,
        fileName: `${section} (merged)`,
        code: this.mergeStrategy.merge(section, fragments),
      };
    }
    // Safe: every section is a NarratYaml and the required ones were checked above.
    return config as ModuleConfigInput;
  }

  private groupFragmentsBySection(
    modules: readonly ContentModule[],
  ): Map<ConfigKey, NarratYaml[]> {
    const grouped = new Map<ConfigKey, NarratYaml[]>();
    for (const module of modules) {
      for (const [section, fragments] of Object.entries(module.config ?? {})) {
        const key = section as ConfigKey;
        grouped.set(key, [...(grouped.get(key) ?? []), ...(fragments ?? [])]);
      }
    }
    return grouped;
  }

  private assertRequiredSections(grouped: Map<ConfigKey, NarratYaml[]>): void {
    const missing = REQUIRED_SECTIONS.filter(
      (section) => !grouped.has(section),
    );
    if (missing.length > 0) {
      throw new Error(
        `Missing required config sections: ${missing.join(", ")}.`,
      );
    }
  }
}
