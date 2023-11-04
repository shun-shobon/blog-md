import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";
import { astarToString } from "../to-string.js";

export const heading: Handler<Mdast.Heading> = (
  node,
  state,
): Astar.Heading | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  const plain = astarToString(...children);
  const id = state.headingSlugger.slug(plain);

  return {
    type: "heading",
    level: node.depth,
    id,
    plain,
    children,
    position: node.position,
  };
};
