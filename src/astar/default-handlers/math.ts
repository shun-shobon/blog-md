import type { Math } from "mdast-util-math";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const math: Handler<Math> = (node): Astar.Math => {
  return {
    type: "math",
    value: node.value,
    position: node.position,
  };
};
