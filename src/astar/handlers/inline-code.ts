import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const inlineCode: Handler<Mdast.InlineCode> = (
  node,
): Astar.InlineCode => {
  return {
    type: "inlineCode",
    value: node.value,
    position: node.position,
  };
};
