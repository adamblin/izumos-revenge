import "narrat/dist/narrat.css";
import "./css/main.css";
import { DEBUG } from "./constants";
import { contentModules } from "./content";
import { bootstrap } from "./core/bootstrap";
import { createPlugins } from "./game/plugins";
import { strings } from "./strings/strings";

// Composition root: the only place where content, plugins and engine meet.
window.addEventListener("load", () => {
  bootstrap({
    debug: DEBUG,
    defaultLanguage: "en",
    translations: strings,
    modules: contentModules,
    plugins: createPlugins(),
  });
});
