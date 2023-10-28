import GitHubSlugger from "github-slugger";
import type * as Mdast from "mdast";
import type { InlineMath, Math } from "mdast-util-math";

import type * as AST from "../ast.js";
import { unreachable, UnreachableError } from "../error.js";
import type {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../parse/extensions/description-list.js";
import type { Embed } from "../parse/extensions/embed.js";
import { astToString } from "./to-string.js";

export interface State {
  slugger: GitHubSlugger;
}

export function convertChildren(
  state: State,
  node: Mdast.Parent,
): Array<AST.Content> {
  return node.children
    .map((n) => convertNode(state, n))
    .filter((x): x is AST.Content => x !== undefined);
}

// eslint-disable-next-line complexity
export function convertNode(
  state: State,
  node: Mdast.RootContent,
): AST.Content | undefined {
  switch (node.type) {
    case "text":
      return convertText(state, node);
    case "strong":
      return convertStrong(state, node);
    case "emphasis":
      return convertEmphasis(state, node);
    case "delete":
      return convertDelete(state, node);
    case "inlineCode":
      return convertInlineCode(state, node);
    case "inlineMath":
      return convertInlineMath(state, node);
    case "link":
      return convertLink(state, node);
    case "image":
      return convertImage(state, node);
    case "break":
      return convertBreak(state, node);
    case "thematicBreak":
      return convertThematicBreak(state, node);
    case "html":
      return convertHtml(state, node);
    case "heading":
      return convertHeading(state, node);
    case "paragraph":
      return convertParagraph(state, node);
    case "blockquote":
      return convertBlockquote(state, node);
    case "list":
      return convertList(state, node);
    case "listItem":
      return convertListItem(state, node);
    case "descriptionList":
      return convertDescriptionList(state, node);
    case "descriptionTerm":
      return convertDescriptionTerm(state, node);
    case "descriptionDetails":
      return convertDescriptionDetails(state, node);
    case "table":
      return convertTable(state, node);
    case "tableRow":
      return convertTableRow(state, node);
    case "tableCell":
      return convertTableCell(state, node);
    case "code":
      return convertCode(state, node);
    case "math":
      return convertMath(state, node);
    case "embed":
      return convertEmbed(state, node);
    case "linkReference":
    case "imageReference":
    case "yaml":
      throw new UnreachableError();
    case "definition":
      return undefined;
    case "footnoteDefinition":
    case "footnoteReference":
      // TODO: 脚注を実装
      return undefined;
  }
}

function convertText(_state: State, node: Mdast.Text): AST.Text {
  const text: AST.Text = {
    type: "text",
    value: node.value,
    position: node.position,
  };
  return text;
}

function convertStrong(
  state: State,
  node: Mdast.Strong,
): AST.Strong | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const strong: AST.Strong = {
    type: "strong",
    children,
    position: node.position,
  };
  return strong;
}

function convertEmphasis(
  state: State,
  node: Mdast.Emphasis,
): AST.Emphasis | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const emphasis: AST.Emphasis = {
    type: "emphasis",
    children,
    position: node.position,
  };
  return emphasis;
}

function convertDelete(
  state: State,
  node: Mdast.Delete,
): AST.Delete | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const del: AST.Delete = {
    type: "delete",
    children,
    position: node.position,
  };
  return del;
}

function convertInlineCode(
  _state: State,
  node: Mdast.InlineCode,
): AST.InlineCode {
  const inlineCode: AST.InlineCode = {
    type: "inlineCode",
    value: node.value,
    position: node.position,
  };
  return inlineCode;
}

function convertInlineMath(_state: State, node: InlineMath): AST.InlineMath {
  const inlineMath: AST.InlineMath = {
    type: "inlineMath",
    value: node.value,
    position: node.position,
  };
  return inlineMath;
}

function convertLink(state: State, node: Mdast.Link): AST.Link | undefined {
  const children = convertChildren(state, node);
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

function convertImage(_state: State, node: Mdast.Image): AST.Image {
  const image: AST.Image = {
    type: "image",
    url: node.url,
    alt: node.alt ?? "",
    title: node.title ?? undefined,
    position: node.position,
  };
  return image;
}

function convertBreak(_state: State, node: Mdast.Break): AST.Break {
  const br: AST.Break = {
    type: "break",
    position: node.position,
  };
  return br;
}

function convertThematicBreak(
  _state: State,
  node: Mdast.ThematicBreak,
): AST.ThematicBreak {
  const thematicBreak: AST.ThematicBreak = {
    type: "thematicBreak",
    position: node.position,
  };
  return thematicBreak;
}

function convertHtml(_state: State, node: Mdast.Html): AST.Html {
  const html: AST.Html = {
    type: "html",
    value: node.value,
    position: node.position,
  };
  return html;
}

function convertHeading(
  state: State,
  node: Mdast.Heading,
): AST.Heading | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const plain = astToString(...children);
  const id = state.slugger.slug(plain);

  const heading: AST.Heading = {
    type: "heading",
    level: node.depth,
    id,
    plain,
    children,
    position: node.position,
  };
  return heading;
}

function convertParagraph(
  state: State,
  node: Mdast.Paragraph,
): AST.Paragraph | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const paragraph: AST.Paragraph = {
    type: "paragraph",
    children,
    position: node.position,
  };
  return paragraph;
}

function convertBlockquote(
  state: State,
  node: Mdast.Blockquote,
): AST.Blockquote | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const blockquote: AST.Blockquote = {
    type: "blockquote",
    children,
    position: node.position,
  };
  return blockquote;
}

function convertList(
  state: State,
  node: Mdast.List,
): AST.UnorderedList | AST.OrderedList | undefined {
  const children = convertChildren(state, node);
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

function convertListItem(
  state: State,
  node: Mdast.ListItem,
): AST.ListItem | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const listItem: AST.ListItem = {
    type: "listItem",
    children,
    position: node.position,
  };
  return listItem;
}

function convertDescriptionList(
  state: State,
  node: DescriptionList,
): AST.DescriptionList | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const descriptionList: AST.DescriptionList = {
    type: "descriptionList",
    children,
    position: node.position,
  };
  return descriptionList;
}

function convertDescriptionTerm(
  state: State,
  node: DescriptionTerm,
): AST.DescriptionTerm | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const descriptionTerm: AST.DescriptionTerm = {
    type: "descriptionTerm",
    children,
    position: node.position,
  };
  return descriptionTerm;
}

function convertDescriptionDetails(
  state: State,
  node: DescriptionDetails,
): AST.DescriptionDetails | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const descriptionDetails: AST.DescriptionDetails = {
    type: "descriptionDetails",
    children,
    position: node.position,
  };
  return descriptionDetails;
}

function convertTable(state: State, node: Mdast.Table): AST.Table | undefined {
  const children = convertChildren(state, node);
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

function convertTableRow(
  state: State,
  node: Mdast.TableRow,
): AST.TableRow | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const tableRow: AST.TableRow = {
    type: "tableRow",
    children,
    position: node.position,
  };
  return tableRow;
}

function convertTableCell(
  state: State,
  node: Mdast.TableCell,
): AST.TableCell | undefined {
  const children = convertChildren(state, node);
  if (children.length === 0) return undefined;

  const tableCell: AST.TableCell = {
    type: "tableCell",
    children,
    position: node.position,
  };
  return tableCell;
}

function convertCode(_state: State, node: Mdast.Code): AST.Code {
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

function convertMath(_state: State, node: Math): AST.Math {
  const math: AST.Math = {
    type: "math",
    value: node.value,
    position: node.position,
  };
  return math;
}

function convertEmbed(_state: State, node: Embed): AST.Embed {
  const embed: AST.Embed = {
    type: "embed",
    value: node.value,
    position: node.position,
  };
  return embed;
}
