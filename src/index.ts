import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { astarTransform } from "./astar/astar-transform.js";
import {
  remarkDescriptionList,
  remarkEmbed,
  remarkResolveReference,
} from "./remark/index.js";

export async function parseMarkdown(source: string): Promise<never> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkResolveReference)
    .use(remarkDescriptionList)
    .use(remarkEmbed)
    .use(astarTransform)
    .freeze();

  const _file = await processor.process(source);

  // TODO: parse markdown
  throw new Error("Not implemented");
}
