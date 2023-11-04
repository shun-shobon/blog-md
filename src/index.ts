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
  return unified()
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
}

export async function parseMarkdown(source: string): Promise<never> {
  const processor = createProcessor();

  const _file = await processor.process(source);

  // TODO: parse markdown
  throw new Error("Not implemented");
}
