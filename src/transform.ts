import type * as Mdast from "mdast";
import type { InlineMath, Math } from "mdast-util-math";

import type * as AST from "./ast.js";
import { unreachable } from "./error.js";
import type {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./extensions/description-list.js";
import type { Embed } from "./extensions/embed.js";

export function transform(tree: Mdast.Root): AST.Root {
  const children = transformChildren(tree);

  const root: AST.Root = {
    type: "root",
    children,
    position: tree.position,
  };
  return root;
}

// eslint-disable-next-line complexity
function transformContent(node: Mdast.RootContent): AST.Content | undefined {
  switch (node.type) {
    case "text":
      return transformText(node);
    case "strong":
      return transformStrong(node);
    case "emphasis":
      return transformEmphasis(node);
    case "delete":
      return transformDelete(node);
    case "inlineCode":
      return transformInlineCode(node);
    case "inlineMath":
      return transformInlineMath(node);
    case "link":
      return transformLink(node);
    case "image":
      return transformImage(node);
    case "break":
      return transformBreak(node);
    case "thematicBreak":
      return transformThematicBreak(node);
    case "html":
      return transformHtml(node);
    case "heading":
      return transformHeading(node);
    case "paragraph":
      return transformParagraph(node);
    case "blockquote":
      return transformBlockquote(node);
    case "list":
      return transformList(node);
    case "listItem":
      return transformListItem(node);
    case "descriptionList":
      return transformDescriptionList(node);
    case "descriptionTerm":
      return transformDescriptionTerm(node);
    case "descriptionDetails":
      return transformDescriptionDetails(node);
    case "table":
      return transformTable(node);
    case "tableRow":
      return transformTableRow(node);
    case "tableCell":
      return transformTableCell(node);
    case "code":
      return transformCode(node);
    case "math":
      return transfromMath(node);
    case "embed":
      return transformEmbed(node);
    case "linkReference":
    case "imageReference":
    case "yaml":
      unreachable();
    // unreachable() はエラーを投げるので、ここには到達しない
    // eslint-disable-next-line no-fallthrough
    case "definition":
      return undefined;
    case "footnoteDefinition":
    case "footnoteReference":
      // TODO: 脚注を実装
      return undefined;
  }
}

function transformChildren(node: Mdast.Parent): Array<AST.Content> {
  return node.children
    .map(transformContent)
    .filter((x): x is AST.Content => x !== undefined);
}

function transformText(node: Mdast.Text): AST.Text {
  const text: AST.Text = {
    type: "text",
    value: node.value,
    position: node.position,
  };
  return text;
}

function transformStrong(node: Mdast.Strong): AST.Strong | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const strong: AST.Strong = {
    type: "strong",
    children,
    position: node.position,
  };
  return strong;
}

function transformEmphasis(node: Mdast.Emphasis): AST.Emphasis | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const emphasis: AST.Emphasis = {
    type: "emphasis",
    children,
    position: node.position,
  };
  return emphasis;
}

function transformDelete(node: Mdast.Delete): AST.Delete | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const del: AST.Delete = {
    type: "delete",
    children,
    position: node.position,
  };
  return del;
}

function transformInlineCode(node: Mdast.InlineCode): AST.InlineCode {
  const inlineCode: AST.InlineCode = {
    type: "inlineCode",
    value: node.value,
    position: node.position,
  };
  return inlineCode;
}

function transformInlineMath(node: InlineMath): AST.InlineMath {
  const inlineMath: AST.InlineMath = {
    type: "inlineMath",
    value: node.value,
    position: node.position,
  };
  return inlineMath;
}

function transformLink(node: Mdast.Link): AST.Link | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const link: AST.Link = {
    type: "link",
    children,
    url: node.url,
    title: node.title ?? undefined,
    position: node.position,
  };
  return link;
}

function transformImage(node: Mdast.Image): AST.Image {
  const image: AST.Image = {
    type: "image",
    url: node.url,
    alt: node.alt ?? "",
    title: node.title ?? undefined,
    position: node.position,
  };
  return image;
}

function transformBreak(node: Mdast.Break): AST.Break {
  const br: AST.Break = {
    type: "break",
    position: node.position,
  };
  return br;
}

function transformThematicBreak(node: Mdast.ThematicBreak): AST.ThematicBreak {
  const thematicBreak: AST.ThematicBreak = {
    type: "thematicBreak",
    position: node.position,
  };
  return thematicBreak;
}

function transformHtml(node: Mdast.Html): AST.Html {
  const html: AST.Html = {
    type: "html",
    value: node.value,
    position: node.position,
  };
  return html;
}

function transformHeading(node: Mdast.Heading): AST.Heading | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const heading: AST.Heading = {
    type: "heading",
    level: node.depth,
    // TODO: idとplainを実装
    id: "",
    plain: "",
    children,
    position: node.position,
  };
  return heading;
}

function transformParagraph(node: Mdast.Paragraph): AST.Paragraph | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const paragraph: AST.Paragraph = {
    type: "paragraph",
    children,
    position: node.position,
  };
  return paragraph;
}

function transformBlockquote(
  node: Mdast.Blockquote,
): AST.Blockquote | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const blockquote: AST.Blockquote = {
    type: "blockquote",
    children,
    position: node.position,
  };
  return blockquote;
}

function transformList(
  node: Mdast.List,
): AST.UnorderedList | AST.OrderedList | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  if (node.ordered ?? false) {
    const orderedList: AST.OrderedList = {
      type: "orderedList",
      start: node.start ?? 1,
      children,
      position: node.position,
    };
    return orderedList;
  }

  const unorderedList: AST.UnorderedList = {
    type: "unorderedList",
    children,
    position: node.position,
  };
  return unorderedList;
}

function transformListItem(node: Mdast.ListItem): AST.ListItem | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const listItem: AST.ListItem = {
    type: "listItem",
    children,
    position: node.position,
  };
  return listItem;
}

function transformDescriptionList(
  node: DescriptionList,
): AST.DescriptionList | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const descriptionList: AST.DescriptionList = {
    type: "descriptionList",
    children,
    position: node.position,
  };
  return descriptionList;
}

function transformDescriptionTerm(
  node: DescriptionTerm,
): AST.DescriptionTerm | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const descriptionTerm: AST.DescriptionTerm = {
    type: "descriptionTerm",
    children,
    position: node.position,
  };
  return descriptionTerm;
}

function transformDescriptionDetails(
  node: DescriptionDetails,
): AST.DescriptionDetails | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const descriptionDetails: AST.DescriptionDetails = {
    type: "descriptionDetails",
    children,
    position: node.position,
  };
  return descriptionDetails;
}

function transformTable(node: Mdast.Table): AST.Table | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const table: AST.Table = {
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
  return table;
}

function transformTableRow(node: Mdast.TableRow): AST.TableRow | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const tableRow: AST.TableRow = {
    type: "tableRow",
    children,
    position: node.position,
  };
  return tableRow;
}

function transformTableCell(node: Mdast.TableCell): AST.TableCell | undefined {
  const children = transformChildren(node);
  if (children.length === 0) return undefined;

  const tableCell: AST.TableCell = {
    type: "tableCell",
    children,
    position: node.position,
  };
  return tableCell;
}

function transformCode(node: Mdast.Code): AST.Code {
  const infoStr = `${node.lang ?? ""} ${node.meta ?? ""}`;

  const [langDiff, filename] = infoStr.split(":", 2);
  if (langDiff === undefined) unreachable();
  const langDiffSplited = langDiff.split(" ", 2);
  const [lang, diff] =
    langDiffSplited.length === 2
      ? langDiffSplited[0] === "diff"
        ? [langDiffSplited[1], true]
        : [langDiffSplited.join(" "), false]
      : langDiffSplited[0] === ""
      ? [undefined, false]
      : [langDiffSplited[0], false];

  const code: AST.Code = {
    type: "code",
    lang,
    filename,
    diff,
    value: node.value,
    position: node.position,
  };
  return code;
}

function transfromMath(node: Math): AST.Math {
  const math: AST.Math = {
    type: "math",
    value: node.value,
    position: node.position,
  };
  return math;
}

function transformEmbed(node: Embed): AST.Embed {
  const embed: AST.Embed = {
    type: "embed",
    value: node.value,
    position: node.position,
  };
  return embed;
}
