import type { Link, Literal, Node, Paragraph, Root } from "mdast";
import type { Extension } from "mdast-util-from-markdown";

import { isLink, isParagraph, isText } from "../check.js";
import { visit } from "../visit.js";

export interface Embed extends Literal {
  type: "embed";
}

export function embed(): Extension {
  const transformer = (tree: Root) => {
    visit(tree, isEmbedLike, (node, idx, parent) => {
      if (idx === undefined || !parent) return;

      // Rootの直下以外はEmbedにしない
      if (parent.type !== "root") return;

      const [link] = node.children;
      const embed: Embed = {
        type: "embed",
        value: link.url,
        position: node.position,
      };
      parent.children[idx] = embed;
    });
  };

  return {
    transforms: [transformer],
  };
}

interface EmbedLike extends Paragraph {
  children: [Link];
}

function isEmbedLike(node: Node): node is EmbedLike {
  if (!isParagraph(node)) return false;

  const [link, ...paragraphRest] = node.children;
  if (paragraphRest.length > 0) return false;
  if (!link || !isLink(link)) return false;

  const [linkText, ...linkRest] = link.children;
  if (linkRest.length > 0) return false;
  if (!linkText || !isText(linkText)) return false;

  if (!/^https?:\/\//u.test(linkText.value)) return false;

  return link.url === linkText.value;
}
