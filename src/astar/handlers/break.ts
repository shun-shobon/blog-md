import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const hardBreak: Handler<Mdast.Break> = (node): Astar.Break => {
  return {
    type: "break",
    position: node.position,
  };
};
