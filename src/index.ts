import type * as Mdast from "mdast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import type { Processor } from "unified";
import { unified } from "unified";

import type * as Astar from "./astar/ast.js";
import {
  astarDescriptionList,
  astarEmbed,
  astarSection,
  astarTransform,
} from "./astar/index.js";
import {
  remarkDescriptionList,
  remarkEmbed,
  remarkResolveReference,
} from "./remark/index.js";

export function createProcessor(): Processor<
  Mdast.Root,
  Mdast.Root,
  Astar.Root
> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkResolveReference)
    .use(remarkDescriptionList)
    .use(remarkEmbed)
    .use(astarTransform)
    .use(astarDescriptionList)
    .use(astarEmbed)
    .use(astarSection)
    .freeze();

  return processor;
}

export async function parseMarkdown(source: string): Promise<Astar.Root> {
  const processor = createProcessor();

  const ast = await processor.run(processor.parse(source));
  return ast;
}
