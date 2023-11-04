import type * as Mdast from "mdast";

import type { Handler, Handlers } from "../astar-transform.js";
import { blockquote } from "./blockquote.js";
import { hardBreak } from "./break.js";
import { code } from "./code.js";
import { strikethrough } from "./delete.js";
import { emphasis } from "./emphasis.js";
import { footnoteReference } from "./footnote-reference.js";
import { heading } from "./heading.js";
import { html } from "./html.js";
import { image } from "./image.js";
import { inlineCode } from "./inline-code.js";
import { inilneMath } from "./inline-math.js";
import { link } from "./link.js";
import { list } from "./list.js";
import { listItem } from "./list-item.js";
import { math } from "./math.js";
import { paragraph } from "./paragraph.js";
import { strong } from "./strong.js";
import { table } from "./table.js";
import { tableCell } from "./table-cell.js";
import { tableRow } from "./table-row.js";
import { text } from "./text.js";
import { thematicBreak } from "./thematic-break.js";

const ignore: Handler<Mdast.Node> = (): undefined => {
  // noop
};

export const defaultHandlers: Handlers = {
  blockquote,
  break: hardBreak,
  code,
  delete: strikethrough,
  emphasis,
  footnoteReference,
  heading,
  html,
  image,
  inlineCode,
  inilneMath,
  link,
  list,
  listItem,
  math,
  paragraph,
  strong,
  table,
  tableCell,
  tableRow,
  text,
  thematicBreak,
  definition: ignore,
  footnoteDefinition: ignore,
};
