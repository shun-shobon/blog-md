import GitHubSlugger from "github-slugger";
import type * as Mdast from "mdast";

import type * as AST from "../../astar/ast.js";
import { astarToString } from "../../astar/to-string.js";
import type { Extension, MdastHandler } from "../extension.js";

export function heading(): Extension {
  const slugger = new GitHubSlugger();

  const handler: MdastHandler<Mdast.Heading> = (node, handleChildren) => {
    const children = handleChildren(node);
    if (children.length === 0) return;

    const plain = astarToString(...children);
    const id = slugger.slug(plain);

    const newNode: AST.Heading = {
      type: "heading",
      level: node.depth,
      id,
      plain,
      children,
      position: node.position,
    };
    return newNode;
  };

  return {
    handlers: {
      heading: handler,
    },
  };
}
