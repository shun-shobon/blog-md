import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const text: Handler<Mdast.Text> = (node): Astar.Text => {
  return {
    type: "text",
    value: node.value,
    position: node.position,
  };
};
