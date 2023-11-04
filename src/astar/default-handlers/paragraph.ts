import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const paragraph: Handler<Mdast.Paragraph> = (
  node,
  state,
): Astar.Paragraph | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "paragraph",
    children,
    position: node.position,
  };
};
