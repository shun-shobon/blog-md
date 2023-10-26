import type { ImageReference, LinkReference, Node } from "mdast";

export function isLinkReference(node: Node): node is LinkReference {
  return node.type === "linkReference";
}

export function isImageReference(node: Node): node is ImageReference {
  return node.type === "imageReference";
}
