import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const list: Handler<Mdast.List> = (
  node,
  state,
): Astar.UnorderedList | Astar.OrderedList | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  if (node.ordered ?? false) {
    return {
      type: "orderedList",
      start: node.start ?? 1,
      children,
      position: node.position,
    };
  }

  return {
    type: "unorderedList",
    children,
    position: node.position,
  };
};
