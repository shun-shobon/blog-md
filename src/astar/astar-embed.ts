import type { Plugin } from "unified";

import type { Embed as MdastEmbed } from "../remark/remark-embed.js";
import type { Embed } from "./ast.js";
import type { Handler } from "./astar-transform.js";

export const astarEmbed: Plugin = function () {
  const data = this.data();

  data.astarFromMdastHandlers ??= {};
  data.astarFromMdastHandlers["embed"] = embed;
};

const embed: Handler<MdastEmbed> = (node): Embed => {
  return {
    type: "embed",
    value: node.value,
    position: node.position,
  };
};
