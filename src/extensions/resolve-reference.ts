import type {
  Definition,
  Link,
  LinkReference,
  Parents,
  PhrasingContent,
  Root,
  RootContent,
} from "mdast";
import { compact } from "mdast-util-compact";
import { definitions } from "mdast-util-definitions";
import type { Extension } from "mdast-util-from-markdown";
import type { Parent, Point } from "unist";
import { visit } from "unist-util-visit";
import * as O from "../option.js";
import { pipe } from "@shun-shobon/pipes";
import { isLinkReference } from "../check.js";

export function resolveReference(): Extension {
  const transformer = (tree: Root) => {
    const definition = definitions(tree);

    visit(tree, isLinkReference, (node, idx, parent) => {
      if (parent === undefined || idx === undefined) return;

      const def = definition(node.identifier);
      // Definitionがない場合、linkではなく通常のtextに変換する
      if (def === undefined) transformBrokenRef(node, idx, parent);
      else resolveRef(node, idx, parent, def);
    });
  };

  return {
    transforms: [transformer],
  };
}

function resolveRef(
  node: LinkReference,
  idx: number,
  parent: Parents,
  def: Definition
): void {
  const newNode: Link = {
    type: "link",
    children: node.children,
    position: node.position,
    url: def.url,
    title: def.title,
  };
  parent.children[idx] = newNode;
}

function transformBrokenRef(
  node: LinkReference,
  idx: number,
  parent: Parents
): void {
  // childrenがある場合、最後のchildの終端の位置を返す
  // childrenがない場合、`[][...]`となっているはずなので、`[`の位置に1足したものを返す
  const linkTextCloseParenStartPoint = pipe(node.children.at(-1)?.position?.end)
    .pipe(O.orElse(() => node.position?.start))
    .pipe(
      O.map((pos) => ({
        line: pos.line,
        column: pos.column + 1,
        offset: pipe(pos.offset).pipe(O.map((x) => x + 1)).value,
      }))
    ).value;

  const newNodes: Array<PhrasingContent> = [
    {
      type: "text",
      value: "[",
      position: pipe(node.position).pipe(
        O.map((pos) => ({
          start: pos.start,
          end: {
            line: pos.start.line,
            column: pos.start.column + 1,
            offset: pipe(pos.start.offset).pipe(O.map((x) => x + 1)).value,
          },
        }))
      ).value,
    },
    ...node.children,
    {
      type: "text",
      value: `][${node.identifier}]`,
      position:
        linkTextCloseParenStartPoint && node.position
          ? {
              start: linkTextCloseParenStartPoint,
              end: node.position.end,
            }
          : undefined,
    },
  ];

  parent.children.splice(idx, 1, ...newNodes);
  compact(parent);
}
