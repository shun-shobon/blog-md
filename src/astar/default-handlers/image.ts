import type * as Mdast from "mdast";

import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const image: Handler<Mdast.Image> = (node): Astar.Image => {
  return {
    type: "image",
    alt: node.alt ?? "",
    url: node.url,
    title: node.title ?? undefined,
    position: node.position,
  };
};
