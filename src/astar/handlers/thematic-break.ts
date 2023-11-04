import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const thematicBreak: Handler<Mdast.ThematicBreak> = (
  node,
): Astar.ThematicBreak => {
  return {
    type: "thematicBreak",
    position: node.position,
  };
};
