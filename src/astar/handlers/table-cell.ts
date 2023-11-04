import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const tableCell: Handler<Mdast.TableCell> = (
  node,
  state,
): Astar.TableCell | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "tableCell",
    children,
    position: node.position,
  };
};
