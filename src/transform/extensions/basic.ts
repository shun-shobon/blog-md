import type * as Mdast from "mdast";

import type * as AST from "../../ast.js";
import type { Extension, MdastHandler } from "../extension.js";

export function basic(): Extension {
  return {
    handlers: {
      text,
      strong,
      emphasis,
      delete: delete_,
      inlineCode,
      link,
      image,
      break: break_,
      thematicBreak,
      html,
      paragraph,
      blockquote,
      list,
      listItem,
      table,
      tableRow,
      tableCell,
    },
  };
}

const text: MdastHandler<Mdast.Text> = (node) => {
  const newNode: AST.Text = {
    type: "text",
    value: node.value,
    position: node.position,
  };

  return newNode;
};

const strong: MdastHandler<Mdast.Strong> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Strong = {
    type: "strong",
    children,
    position: node.position,
  };

  return newNode;
};

const emphasis: MdastHandler<Mdast.Emphasis> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Emphasis = {
    type: "emphasis",
    children,
    position: node.position,
  };

  return newNode;
};

const delete_: MdastHandler<Mdast.Delete> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Delete = {
    type: "delete",
    children,
    position: node.position,
  };

  return newNode;
};

const inlineCode: MdastHandler<Mdast.InlineCode> = (node) => {
  const newNode: AST.InlineCode = {
    type: "inlineCode",
    value: node.value,
    position: node.position,
  };

  return newNode;
};

const link: MdastHandler<Mdast.Link> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Link = {
    type: "link",
    url: node.url,
    title: node.title ?? undefined,
    children,
    position: node.position,
  };

  return newNode;
};

const image: MdastHandler<Mdast.Image> = (node) => {
  const newNode: AST.Image = {
    type: "image",
    alt: node.alt ?? "",
    url: node.url,
    title: node.title ?? undefined,
    position: node.position,
  };

  return newNode;
};

const break_: MdastHandler<Mdast.Break> = (node) => {
  const newNode: AST.Break = {
    type: "break",
    position: node.position,
  };

  return newNode;
};

const thematicBreak: MdastHandler<Mdast.ThematicBreak> = (node) => {
  const newNode: AST.ThematicBreak = {
    type: "thematicBreak",
    position: node.position,
  };

  return newNode;
};

const html: MdastHandler<Mdast.HTML> = (node) => {
  const newNode: AST.Html = {
    type: "html",
    value: node.value,
    position: node.position,
  };

  return newNode;
};

const paragraph: MdastHandler<Mdast.Paragraph> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Paragraph = {
    type: "paragraph",
    children,
    position: node.position,
  };

  return newNode;
};

const blockquote: MdastHandler<Mdast.Blockquote> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Blockquote = {
    type: "blockquote",
    children,
    position: node.position,
  };

  return newNode;
};

const list: MdastHandler<Mdast.List> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  if (node.ordered ?? false) {
    const newNode: AST.OrderedList = {
      type: "orderedList",
      start: node.start ?? 1,
      children,
      position: node.position,
    };
    return newNode;
  }

  const newNode: AST.UnorderedList = {
    type: "unorderedList",
    children,
    position: node.position,
  };
  return newNode;
};

const listItem: MdastHandler<Mdast.ListItem> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.ListItem = {
    type: "listItem",
    children,
    position: node.position,
  };
  return newNode;
};

const table: MdastHandler<Mdast.Table> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.Table = {
    type: "table",
    align:
      node.align ??
      Array.from(
        { length: node.children[0]?.children.length ?? 0 },
        () => null,
      ),
    children,
    position: node.position,
  };
  return newNode;
};

const tableRow: MdastHandler<Mdast.TableRow> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.TableRow = {
    type: "tableRow",
    children,
    position: node.position,
  };
  return newNode;
};

const tableCell: MdastHandler<Mdast.TableCell> = (node, handleChildren) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.TableCell = {
    type: "tableCell",
    children,
    position: node.position,
  };
  return newNode;
};
