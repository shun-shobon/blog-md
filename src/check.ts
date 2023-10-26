import type { LinkReference, Node } from "mdast";

export function isLinkReference(node: Node): node is LinkReference {
  return node.type === "linkReference";
}
