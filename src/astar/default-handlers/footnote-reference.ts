import type * as Mdast from "mdast";

import { unreachable } from "../../error.js";
import type * as Astar from "../ast.js";
import type { Handler } from "../astar-transform.js";

export const footnoteReference: Handler<Mdast.FootnoteReference> = (
  node,
  state,
): Astar.FootnoteReference | undefined => {
  const usedDef = state.astarFootnoteDefinition.get(node.identifier);
  if (usedDef) {
    usedDef.count += 1;

    return {
      type: "footnoteReference",
      footnoteIndex: usedDef.index,
      referenceIndex: usedDef.count,
      position: node.position,
    };
  }

  const mdastDef = state.mdastFootnoteDefinition.get(node.identifier);
  if (!mdastDef) unreachable();

  const footnoteIndex = state.astarFootnoteDefinition.size;
  const newDef: Astar.FootnoteDefinition = {
    type: "footnoteDefinition",
    index: footnoteIndex,
    count: 1,
    children: state.transformAll(mdastDef),
    position: mdastDef.position,
  };
  state.astarFootnoteDefinition.set(node.identifier, newDef);

  return {
    type: "footnoteReference",
    footnoteIndex,
    referenceIndex: 1,
    position: node.position,
  };
};
