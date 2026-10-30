// shims-narrat.d.ts

declare module "*.narrat" {
  import { NarratScript } from "narrat";
  const narratScript: NarratScript;
  export default narratScript;
}

declare module "*.yaml" {
  import type { NarratYaml } from "narrat/dist/types/app-types";
  const narratYaml: NarratYaml;
  export default narratYaml;
}
declare module "*.yml" {
  import type { NarratYaml } from "narrat/dist/types/app-types";
  const narratYaml: NarratYaml;
  export default narratYaml;
}
