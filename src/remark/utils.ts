import type { Root } from "mdast";

import { createProcessor } from "../index.js";

export function parse(content: string): Root {
  const processor = createProcessor();

  const ast = processor.parse(content);
  return ast;
}
