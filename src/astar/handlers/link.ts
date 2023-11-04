import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const link: Handler<Mdast.Link> = (
  node,
  state,
): Astar.Link | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "link",
    url: node.url,
    title: node.title ?? undefined,
    children,
    position: node.position,
  };
};
