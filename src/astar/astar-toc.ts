import type { Plugin } from "unified";

import type { Parent, Root, Toc } from "./ast.js";
import { isSection } from "./check.js";

declare module "unified" {
  interface Data {
    toc?: Array<Toc>;
  }
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
