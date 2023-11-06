import type { Plugin } from "unified";

import type { Node, Parent, Root, Section } from "./ast.js";

declare module "unified" {
  interface Data {
    toc?: Array<Toc>;
  }
}

interface Toc extends Node {
  type: "toc";
  plain: string;
  id: string;
  children: Array<Toc>;
}

export const astarToc: Plugin<Array<never>, Root> = function () {
  const data = this.data();

  return (tree) => {
    const toc = process(tree);

    data.toc ??= toc;
  };
};

function process(tree: Parent): Array<Toc> {
  return tree.children.filter(isSection).map(
    (section): Toc => ({
      type: "toc",
      plain: section.children[0].plain,
      id: section.children[0].id,
      children: process(section),
    }),
  );
}

function isSection(node: Node): node is Section {
  return node.type === "section";
}
