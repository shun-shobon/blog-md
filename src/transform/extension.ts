import type * as Mdast from "mdast";

import type * as AST from "../ast.js";

export interface Extension {
  before?: Before;
  after?: After;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers?: Record<string, MdastHandler<any>>;
  rootData?: () => AST.RootData;
}

export type Before = (tree: Mdast.Root) => void;
export type After = (tree: AST.Root) => void;

export type MdastHandler<T extends Mdast.Node> = (
  node: T,
  handleChildren: (node: Mdast.Parent) => Array<AST.Content>,
) => AST.Content | undefined;
