import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const tableRow: Handler<Mdast.TableRow> = (
  node,
  state,
): Astar.TableRow | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "tableRow",
    children,
    position: node.position,
  };
};
