import type * as Mdast from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import type { Processor } from "unified";
import { unified } from "unified";

import {
  type Article,
  astarArticle,
  astarDescriptionList,
  astarEmbed,
  astarFrontmatter,
  astarSection,
  astarToc,
  astarTransform,
} from "./astar/index.js";
import {
  remarkDescriptionList,
  remarkEmbed,
  remarkResolveReference,
} from "./remark/index.js";

export function createProcessor(): Processor<Mdast.Root, Mdast.Root, Article> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkResolveReference)
    .use(remarkDescriptionList)
    .use(remarkEmbed)
    .use(astarTransform)
    .use(astarFrontmatter)
    .use(astarDescriptionList)
    .use(astarEmbed)
    .use(astarSection)
    .use(astarToc)
    .use(astarArticle)
    .freeze();

  return processor;
}

export async function parseMarkdown(source: string): Promise<Article> {
  const processor = createProcessor();

  const ast = await processor.run(processor.parse(source));
  return ast;
}
