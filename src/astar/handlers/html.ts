import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const html: Handler<Mdast.Html> = (node): Astar.Html => {
  return {
    type: "html",
    value: node.value,
    position: node.position,
  };
};
