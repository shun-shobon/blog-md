import type * as AST from "../../astar/ast.js";
import type { Embed } from "../../remark/remark-embed.js";
import type { Extension, MdastHandler } from "../extension.js";

export function embed(): Extension {
  return {
    handlers: {
      embed: embedNode,
    },
  };
}

const embedNode: MdastHandler<Embed> = (node) => {
  const newNode: AST.Embed = {
    type: "embed",
    value: node.value,
    position: node.position,
  };

  return newNode;
};
