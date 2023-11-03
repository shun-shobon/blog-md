import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";

export async function parseMarkdown(source: string): Promise<never> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .freeze();

  const _file = await processor.process(source);

  // TODO: parse markdown
  throw new Error("Not implemented");
}
