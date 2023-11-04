import type * as Mdast from "mdast";

import type * as AST from "../../astar/ast.js";
import { isFootnoteDefinition } from "../../check.js";
import { unreachable } from "../../error.js";
import { visit } from "../../visit.js";
import type { After, Before, Extension, MdastHandler } from "../extension.js";

export function footnote(): Extension {
  const mdastDefMap = new Map<string, Mdast.FootnoteDefinition>();
  const usedDefMap = new Map<string, AST.FootnoteDefinition>();

  const before: Before = (tree) => {
    visit(tree, isFootnoteDefinition, (node) => {
      mdastDefMap.set(node.identifier, node);
    });
  };

  const handler: MdastHandler<Mdast.FootnoteReference> = (
    node,
    handleChildren,
  ) => {
    const useDef = usedDefMap.get(node.identifier);
    if (useDef) {
      useDef.count += 1;

      const newNode: AST.FootnoteReference = {
        type: "footnoteReference",
        footnoteIndex: useDef.index,
        referenceIndex: useDef.count,
        position: node.position,
      };
      return newNode;
    }

    const mdastDef = mdastDefMap.get(node.identifier);
    if (!mdastDef) unreachable();

    const footnoteIndex = usedDefMap.size;
    const newDef: AST.FootnoteDefinition = {
      type: "footnoteDefinition",
      index: footnoteIndex,
      count: 1,
      children: handleChildren(mdastDef),
      position: mdastDef.position,
    };
    usedDefMap.set(node.identifier, newDef);

    const newNode: AST.FootnoteReference = {
      type: "footnoteReference",
      footnoteIndex,
      referenceIndex: 1,
      position: node.position,
    };
    return newNode;
  };

  const rootData = (): AST.RootData => {
    const footnotes = [...usedDefMap.values()].sort(
      (a, b) => a.index - b.index,
    );
    if (footnotes.length === 0) return {};

    return { footnotes };
  };

  const after: After = () => {
    mdastDefMap.clear();
    usedDefMap.clear();
  };

  return {
    before,
    handlers: {
      footnoteReference: handler,
      footnoteDefinition: noop,
    },
    rootData,
    after,
  };
}

const noop = (): undefined => {
  /* noop */
};
