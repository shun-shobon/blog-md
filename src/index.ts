import type { Root } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { math } from "micromark-extension-math";

import { descriptionList } from "./extensions/description-list.js";
import { resolveReference } from "./extensions/resolve-reference.js";

export function transform(content: string): Root {
  return fromMarkdown(content, {
    extensions: [gfm(), math()],
    mdastExtensions: [resolveReference(), descriptionList()],
  });
}
