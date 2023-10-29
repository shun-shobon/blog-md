import type { Root as MdastRoot } from "mdast";

import type { Root } from "../ast.js";
import { convertChildren, newState } from "./convert.js";
import { gatherFootnoteDef } from "./footnote.js";
import { sectionize } from "./section.js";

export function transform(tree: MdastRoot): Root {
  const footnoteDefMap = gatherFootnoteDef(tree);

  const state = newState(footnoteDefMap);
  const children = convertChildren(state, tree);

  const footnotes = [...state.usedFootnoteDefs.values()].sort(
    (a, b) => a.index - b.index,
  );

  const root: Root = {
    type: "root",
    footnotes,
    children,
    position: tree.position,
  };

  sectionize(root);

  return root;
}
