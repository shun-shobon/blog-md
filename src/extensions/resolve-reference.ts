import type { Image, ImageReference, Link, LinkReference, Root } from "mdast";
import { definitions } from "mdast-util-definitions";
import type { Extension } from "mdast-util-from-markdown";
import { isImageReference, isLinkReference } from "../check.js";
import { visit } from "../visit.js";
import { match } from "ts-pattern";

export function resolveReference(): Extension {
  const transformer = (tree: Root) => {
    const definition = definitions(tree);

    visit(
      tree,
      (node): node is LinkReference | ImageReference =>
        isLinkReference(node) || isImageReference(node),
      (node, idx, parent) => {
        if (parent === undefined || idx === undefined) return;

        const def = definition(node.identifier);
        if (def === undefined) return;

        const newNode = match(node)
          .when(
            isLinkReference,
            (linkRef): Link => ({
              type: "link",
              children: linkRef.children,
              position: linkRef.position,
              url: def.url,
              title: def.title,
            })
          )
          .when(
            isImageReference,
            (imgRef): Image => ({
              type: "image",
              alt: imgRef.alt,
              position: imgRef.position,
              url: def.url,
              title: def.title,
            })
          )
          .exhaustive();

        parent.children[idx] = newNode;
      }
    );
  };

  return {
    transforms: [transformer],
  };
}
