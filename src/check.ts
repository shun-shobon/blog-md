import type * as Mdast from "mdast";

export function isLinkReference(node: Mdast.Node): node is Mdast.LinkReference {
  return node.type === "linkReference";
}

export function isImageReference(
  node: Mdast.Node,
): node is Mdast.ImageReference {
  return node.type === "imageReference";
}

export function isList(node: Mdast.Node): node is Mdast.List {
  return node.type === "list";
}

export function isListItem(node: Mdast.Node): node is Mdast.ListItem {
  return node.type === "listItem";
}

export function isParagraph(node: Mdast.Node): node is Mdast.Paragraph {
  return node.type === "paragraph";
}

export function isText(node: Mdast.Node): node is Mdast.Text {
  return node.type === "text";
}

export function isLink(node: Mdast.Node): node is Mdast.Link {
  return node.type === "link";
}

export function isFootnoteDefinition(
  node: Mdast.Node,
): node is Mdast.FootnoteDefinition {
  return node.type === "footnoteDefinition";
}
