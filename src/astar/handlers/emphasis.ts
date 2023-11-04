import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const emphasis: Handler<Mdast.Emphasis> = (
  node,
  state,
): Astar.Emphasis | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "emphasis",
    children,
    position: node.position,
  };
};
