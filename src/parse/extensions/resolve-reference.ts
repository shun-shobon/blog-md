import type { Image, ImageReference, Link, LinkReference, Root } from "mdast";
import { definitions } from "mdast-util-definitions";
import type { Extension } from "mdast-util-from-markdown";
import { match } from "ts-pattern";

import { isImageReference, isLinkReference } from "../../check.js";
import { unreachable } from "../../error.js";
import { visit } from "../../visit.js";

export function resolveReference(): Extension {
  const transformer = (tree: Root) => {
    const definition = definitions(tree);

    visit(
      tree,
      (node): node is LinkReference | ImageReference =>
        isLinkReference(node) || isImageReference(node),
      (node, idx, parent) => {
        if (idx === undefined || !parent) unreachable();

        const def = definition(node.identifier);
        if (!def) unreachable();

        const newNode = match(node)
          .when(
            isLinkReference,
            (linkRef): Link => ({
              type: "link",
              children: linkRef.children,
              position: linkRef.position,
              url: def.url,
              title: def.title,
            }),
          )
          .when(
            isImageReference,
            (imgRef): Image => ({
              type: "image",
              alt: imgRef.alt,
              position: imgRef.position,
              url: def.url,
              title: def.title,
            }),
          )
          .exhaustive();

        parent.children[idx] = newNode;
      },
    );
  };

  return {
    transforms: [transformer],
  };
}
