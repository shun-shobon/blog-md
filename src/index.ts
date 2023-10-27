import type { Root } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmAutolinkLiteralFromMarkdown } from "mdast-util-gfm-autolink-literal";
import { gfmAutolinkLiteral } from "micromark-extension-gfm-autolink-literal";
import { gfmFootnote } from "micromark-extension-gfm-footnote";
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmTable } from "micromark-extension-gfm-table";
import { math } from "micromark-extension-math";

import { descriptionList } from "./extensions/description-list.js";
import { embed } from "./extensions/embed.js";
import { resolveReference } from "./extensions/resolve-reference.js";

export function transform(content: string): Root {
  return fromMarkdown(content, {
    extensions: [
      gfmAutolinkLiteral(),
      gfmFootnote(),
      gfmStrikethrough(),
      gfmTable(),
      math(),
    ],
    mdastExtensions: [
      gfmAutolinkLiteralFromMarkdown(),
      resolveReference(),
      descriptionList(),
      embed(),
    ],
  });
}
