import type { Link, Root, RootContent } from "mdast";
import { compact } from "mdast-util-compact";
import { definitions } from "mdast-util-definitions";
import type { Extension } from "mdast-util-from-markdown";
import type { Point } from "unist";
import { visit } from "unist-util-visit";

export function resolveReference(): Extension {
  const transformer = (tree: Root) => {
    const definition = definitions(tree);

    visit(tree, "linkReference", (node, idx, parent) => {
      if (parent === undefined || idx === undefined) return;

      const def = definition(node.identifier);
      if (def !== undefined) {
        const newNode: Link = {
          type: "link",
          children: node.children,
          position: node.position,
          url: def.url,
          title: def.title,
        };
        parent.children[idx] = newNode;
        return;
      }

      // linkの参照先がない場合は、ただのtextとして扱う

      /**
       * linkのtextの終端の位置
       *
       * [**text**][link]
       *          ^ ここ
       */
      const linkTextCloseParenStartPoint: Point | undefined = (() => {
        // childrenがある場合、最後のchildの終端の位置を返す
        const childrenEndPoint = node.children.at(-1)?.position?.end;
        if (childrenEndPoint !== undefined) return childrenEndPoint;

        // childrenがない場合、`[][...]`となっているはずなので、`[`の位置に1足したものを返す
        const nodeStartPoint = node.position?.start;
        if (nodeStartPoint === undefined) return undefined;

        return {
          line: nodeStartPoint.line,
          column: nodeStartPoint.column + 1,
          offset: nodeStartPoint.offset ? nodeStartPoint.offset + 1 : undefined,
        };
      })();

      const newNodes: Array<RootContent> = [
        {
          type: "text",
          value: "[",
          position: node.position
            ? {
                start: node.position.start,
                end: {
                  line: node.position.start.line,
                  column: node.position.start.column + 1,
                  offset: node.position.start.offset
                    ? node.position.start.offset + 1
                    : undefined,
                },
              }
            : undefined,
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
    });
  };

  return {
    transforms: [transformer],
  };
}
