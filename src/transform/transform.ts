import GitHubSlugger from "github-slugger";
import type { Root as MdastRoot } from "mdast";

import type { Root } from "../ast.js";
import { convertChildren, type State } from "./from-mdast.js";

export function transform(tree: MdastRoot): Root {
  const state: State = {
    slugger: new GitHubSlugger(),
  };

  const children = convertChildren(state, tree);

  const root: Root = {
    type: "root",
    children,
    position: tree.position,
  };
  return root;
}
