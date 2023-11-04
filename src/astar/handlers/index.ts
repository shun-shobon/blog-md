import type * as Mdast from "mdast";

import type { Handler, Handlers } from "../astar-transform.js";
import { blockquote } from "./blockquote.js";
import { hardBreak } from "./break.js";
import { strikethrough } from "./delete.js";
import { emphasis } from "./emphasis.js";
import { html } from "./html.js";
import { image } from "./image.js";
import { inlineCode } from "./inline-code.js";
import { link } from "./link.js";
import { list } from "./list.js";
import { listItem } from "./list-item.js";
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

export const handlers: Handlers = {
  blockquote,
  break: hardBreak,
  delete: strikethrough,
  emphasis,
  html,
  image,
  inlineCode,
  link,
  list,
  listItem,
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
