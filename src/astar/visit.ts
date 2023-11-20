import { visit as unistVisit } from "unist-util-visit";

import type { Node, Parent } from "./ast.js";

export const visit = unistVisit as <T extends Node>(
  tree: Parent,
  test: (node: Node) => node is T,
  visitor: (
    node: T,
    index: number | undefined,
    parent: Parent | undefined,
  ) => void,
) => void;
