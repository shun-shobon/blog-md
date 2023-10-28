import type {
  FootnoteDefinition as MdastFootnoteDefinition,
  Root as MdastRoot,
} from "mdast";

import { isFootnoteDefinition } from "../parse/check.js";
import { visit } from "../parse/visit.js";

export function gatherFootnoteDef(
  tree: MdastRoot,
): Map<string, MdastFootnoteDefinition> {
  const footnoteDefMap = new Map<string, MdastFootnoteDefinition>();

  visit(tree, isFootnoteDefinition, (node) => {
    footnoteDefMap.set(node.identifier, node);
  });

  return footnoteDefMap;
}
