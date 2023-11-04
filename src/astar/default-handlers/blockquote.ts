import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const blockquote: Handler<Mdast.Blockquote> = (
  node,
  state,
): Astar.Blockquote | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "blockquote",
    children,
    position: node.position,
  };
};
