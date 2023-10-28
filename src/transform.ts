import GitHubSlugger from "github-slugger";
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
import { astToString } from "./to-string.js";

interface State {
  slugger: GitHubSlugger;
}

export function transform(tree: Mdast.Root): AST.Root {
  const state: State = {
    slugger: new GitHubSlugger(),
  };

  const children = transformChildren(state, tree);

  const root: AST.Root = {
    type: "root",
    children,
    position: tree.position,
  };
  return root;
}

// eslint-disable-next-line complexity
function transformContent(
  state: State,
  node: Mdast.RootContent,
): AST.Content | undefined {
  switch (node.type) {
    case "text":
      return transformText(state, node);
    case "strong":
      return transformStrong(state, node);
    case "emphasis":
      return transformEmphasis(state, node);
    case "delete":
      return transformDelete(state, node);
    case "inlineCode":
      return transformInlineCode(state, node);
    case "inlineMath":
      return transformInlineMath(state, node);
    case "link":
      return transformLink(state, node);
    case "image":
      return transformImage(state, node);
    case "break":
      return transformBreak(state, node);
    case "thematicBreak":
      return transformThematicBreak(state, node);
    case "html":
      return transformHtml(state, node);
    case "heading":
      return transformHeading(state, node);
    case "paragraph":
      return transformParagraph(state, node);
    case "blockquote":
      return transformBlockquote(state, node);
    case "list":
      return transformList(state, node);
    case "listItem":
      return transformListItem(state, node);
    case "descriptionList":
      return transformDescriptionList(state, node);
    case "descriptionTerm":
      return transformDescriptionTerm(state, node);
    case "descriptionDetails":
      return transformDescriptionDetails(state, node);
    case "table":
      return transformTable(state, node);
    case "tableRow":
      return transformTableRow(state, node);
    case "tableCell":
      return transformTableCell(state, node);
    case "code":
      return transformCode(state, node);
    case "math":
      return transfromMath(state, node);
    case "embed":
      return transformEmbed(state, node);
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

function transformChildren(
  state: State,
  node: Mdast.Parent,
): Array<AST.Content> {
  return node.children
    .map((n) => transformContent(state, n))
    .filter((x): x is AST.Content => x !== undefined);
}

function transformText(_state: State, node: Mdast.Text): AST.Text {
  const text: AST.Text = {
    type: "text",
    value: node.value,
    position: node.position,
  };
  return text;
}

function transformStrong(
  state: State,
  node: Mdast.Strong,
): AST.Strong | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const strong: AST.Strong = {
    type: "strong",
    children,
    position: node.position,
  };
  return strong;
}

function transformEmphasis(
  state: State,
  node: Mdast.Emphasis,
): AST.Emphasis | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const emphasis: AST.Emphasis = {
    type: "emphasis",
    children,
    position: node.position,
  };
  return emphasis;
}

function transformDelete(
  state: State,
  node: Mdast.Delete,
): AST.Delete | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const del: AST.Delete = {
    type: "delete",
    children,
    position: node.position,
  };
  return del;
}

function transformInlineCode(
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

function transformInlineMath(_state: State, node: InlineMath): AST.InlineMath {
  const inlineMath: AST.InlineMath = {
    type: "inlineMath",
    value: node.value,
    position: node.position,
  };
  return inlineMath;
}

function transformLink(state: State, node: Mdast.Link): AST.Link | undefined {
  const children = transformChildren(state, node);
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

function transformImage(_state: State, node: Mdast.Image): AST.Image {
  const image: AST.Image = {
    type: "image",
    url: node.url,
    alt: node.alt ?? "",
    title: node.title ?? undefined,
    position: node.position,
  };
  return image;
}

function transformBreak(_state: State, node: Mdast.Break): AST.Break {
  const br: AST.Break = {
    type: "break",
    position: node.position,
  };
  return br;
}

function transformThematicBreak(
  _state: State,
  node: Mdast.ThematicBreak,
): AST.ThematicBreak {
  const thematicBreak: AST.ThematicBreak = {
    type: "thematicBreak",
    position: node.position,
  };
  return thematicBreak;
}

function transformHtml(_state: State, node: Mdast.Html): AST.Html {
  const html: AST.Html = {
    type: "html",
    value: node.value,
    position: node.position,
  };
  return html;
}

function transformHeading(
  state: State,
  node: Mdast.Heading,
): AST.Heading | undefined {
  const children = transformChildren(state, node);
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

function transformParagraph(
  state: State,
  node: Mdast.Paragraph,
): AST.Paragraph | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const paragraph: AST.Paragraph = {
    type: "paragraph",
    children,
    position: node.position,
  };
  return paragraph;
}

function transformBlockquote(
  state: State,
  node: Mdast.Blockquote,
): AST.Blockquote | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const blockquote: AST.Blockquote = {
    type: "blockquote",
    children,
    position: node.position,
  };
  return blockquote;
}

function transformList(
  state: State,
  node: Mdast.List,
): AST.UnorderedList | AST.OrderedList | undefined {
  const children = transformChildren(state, node);
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

function transformListItem(
  state: State,
  node: Mdast.ListItem,
): AST.ListItem | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const listItem: AST.ListItem = {
    type: "listItem",
    children,
    position: node.position,
  };
  return listItem;
}

function transformDescriptionList(
  state: State,
  node: DescriptionList,
): AST.DescriptionList | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const descriptionList: AST.DescriptionList = {
    type: "descriptionList",
    children,
    position: node.position,
  };
  return descriptionList;
}

function transformDescriptionTerm(
  state: State,
  node: DescriptionTerm,
): AST.DescriptionTerm | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const descriptionTerm: AST.DescriptionTerm = {
    type: "descriptionTerm",
    children,
    position: node.position,
  };
  return descriptionTerm;
}

function transformDescriptionDetails(
  state: State,
  node: DescriptionDetails,
): AST.DescriptionDetails | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const descriptionDetails: AST.DescriptionDetails = {
    type: "descriptionDetails",
    children,
    position: node.position,
  };
  return descriptionDetails;
}

function transformTable(
  state: State,
  node: Mdast.Table,
): AST.Table | undefined {
  const children = transformChildren(state, node);
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

function transformTableRow(
  state: State,
  node: Mdast.TableRow,
): AST.TableRow | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const tableRow: AST.TableRow = {
    type: "tableRow",
    children,
    position: node.position,
  };
  return tableRow;
}

function transformTableCell(
  state: State,
  node: Mdast.TableCell,
): AST.TableCell | undefined {
  const children = transformChildren(state, node);
  if (children.length === 0) return undefined;

  const tableCell: AST.TableCell = {
    type: "tableCell",
    children,
    position: node.position,
  };
  return tableCell;
}

function transformCode(_state: State, node: Mdast.Code): AST.Code {
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

function transfromMath(_state: State, node: Math): AST.Math {
  const math: AST.Math = {
    type: "math",
    value: node.value,
    position: node.position,
  };
  return math;
}

function transformEmbed(_state: State, node: Embed): AST.Embed {
  const embed: AST.Embed = {
    type: "embed",
    value: node.value,
    position: node.position,
  };
  return embed;
}
