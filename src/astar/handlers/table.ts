import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const table: Handler<Mdast.Table> = (
  node,
  state,
): Astar.Table | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  const align =
    node.align ??
    Array.from({ length: node.children[0]?.children.length ?? 0 }, () => null);

  return {
    type: "table",
    align,
    children,
    position: node.position,
  };
};
