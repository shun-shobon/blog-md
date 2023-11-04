import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const strikethrough: Handler<Mdast.Delete> = (
  node,
  state,
): Astar.Delete | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "delete",
    children,
    position: node.position,
  };
};
