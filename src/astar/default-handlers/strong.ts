import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const strong: Handler<Mdast.Strong> = (
  node,
  state,
): Astar.Strong | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "strong",
    children,
    position: node.position,
  };
};
