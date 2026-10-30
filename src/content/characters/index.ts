import { defineContentModule } from "@/core/content/ContentModule";
import characters from "./characters.yaml";
import izumo from "./izumo.yaml";

/** The cast. Characters are global so any chapter can use them. */
export default defineContentModule({
  id: "characters",
  config: {
    characters: [characters, izumo],
  },
});
