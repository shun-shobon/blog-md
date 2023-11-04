import type { Yaml } from "mdast";
import type { Plugin } from "unified";
import * as YAML from "yaml";

import type { Handler } from "./astar-transform.js";

declare module "unified" {
  interface Data {
    frontmatter?: unknown;
  }
}

export const astarFrontmatter: Plugin = function () {
  const data = this.data();

  const yaml: Handler<Yaml> = (node): undefined => {
    const parsed: unknown = YAML.parse(node.value);

    data.frontmatter ??= parsed;
  };

  data.astarFromMdastHandlers ??= {};
  data.astarFromMdastHandlers["yaml"] = yaml;
};
