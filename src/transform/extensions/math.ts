import type { InlineMath, Math } from "mdast-util-math";

import type * as AST from "../../ast.js";
import type { Extension, MdastHandler } from "../extension.js";

export function math(): Extension {
  return {
    handlers: {
      math: blockMath,
      inlineMath,
    },
  };
}

const blockMath: MdastHandler<Math> = (node) => {
  const newNode: AST.Math = {
    type: "math",
    value: node.value,
    position: node.position,
  };

  return newNode;
};

const inlineMath: MdastHandler<InlineMath> = (node) => {
  const newNode: AST.InlineMath = {
    type: "inlineMath",
    value: node.value,
    position: node.position,
  };

  return newNode;
};
