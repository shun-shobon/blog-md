import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const listItem: Handler<Mdast.ListItem> = (
  node,
  state,
): Astar.ListItem | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "listItem",
    children,
    position: node.position,
  };
};
