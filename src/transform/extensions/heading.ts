import GitHubSlugger from "github-slugger";
import type * as Mdast from "mdast";

import type * as AST from "../../ast.js";
import type { Extension, MdastHandler } from "../extension.js";
import { astToString } from "../to-string.js";

export function heading(): Extension {
  const slugger = new GitHubSlugger();

  const handler: MdastHandler<Mdast.Heading> = (node, handleChildren) => {
    const children = handleChildren(node);
    if (children.length === 0) return;

    const plain = astToString(...children);
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
