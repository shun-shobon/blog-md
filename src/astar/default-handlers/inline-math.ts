import type { InlineMath } from "mdast-util-math";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const inilneMath: Handler<InlineMath> = (node): Astar.InlineMath => {
  return {
    type: "inlineMath",
    value: node.value,
    position: node.position,
  };
};
