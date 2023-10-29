import type { Position } from "unist";

import type { Content, Heading, Node, Parent, Section } from "../ast.js";

export function sectionize(tree: Parent): void {
  traverse(tree, 1);
}

function traverse(tree: Parent, level: number): void {
  if (level > 6) return;

  let index: number | undefined = undefined;
  while (index !== undefined ? index > tree.children.length : true) {
    const startIdx = findNodeAfter(tree, index, isHeadingOfLevel(level));
    if (startIdx === undefined) return;

    const endIdx = findNodeAfter(tree, startIdx, isHeadingOfLevel(level - 1));

    const children = tree.children.slice(startIdx, endIdx) as [
      Heading,
      ...Array<Content>,
    ];
    const firstChild = children.at(0);
    const lastChild = children.at(-1);
    const position: Position | undefined =
      firstChild?.position && lastChild?.position
        ? {
            start: firstChild.position.start,
            end: lastChild.position.end,
          }
        : undefined;
    const section: Section = {
      type: "section",
      children,
      position,
    };
    tree.children.splice(startIdx, children.length, section);

    traverse(section, level + 1);

    index = startIdx;
  }
}

function isHeadingOfLevel(level: number): (node: Node) => node is Heading {
  return (node): node is Heading => isHeading(node) && node.level === level;
}

function isHeading(node: Node): node is Heading {
  return node.type === "heading";
}

/**
 * after が指定されている場合は、その後のノードから探索を開始する。
 */
function findNodeAfter(
  tree: Parent,
  after: number | undefined,
  predicate: (node: Node) => boolean,
): number | undefined {
  const idx = tree.children.findIndex(
    (node, idx) =>
      (after !== undefined ? idx > after : true) && predicate(node),
  );
  if (idx === -1) return undefined;

  return idx;
}
