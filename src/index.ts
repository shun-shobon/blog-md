import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import { Root } from "mdast";
import { dedent } from "@qnighy/dedent";

function transform(content: string): Root {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkFrontmatter)
    .freeze();

  const ast = processor.parse(content);
  return ast;
}

const content = dedent`
  ---
  title: Hello World
  published: 2021-01-01
  ---

  # Hello World

  This is a paragraph.
  This is another paragraph.

  This is a paragraph with an *emphasis*.
  This is a paragraph with a **strong emphasis**.
  This is a paragraph with a ~~strikethrough~~.
  This is a paragraph with a \`code\`.

  This is a paragraph with an inline math: $\\LaTeX$.

  $$
  \\begin{aligned}
  \\dot{x} & = \\sigma(y-x) \\\\
  \\dot{y} & = \\rho x - y - xz \\\\
  \\dot{z} & = -\\beta z + xy
  \\end{aligned}
  $$

  This is a paragraph with a [link](https://example.com) and an image:

  ![image](https://example.com/image.png)

  This is sample code:

  \`\`\`js
  console.log("Hello World");
  \`\`\`

  - This is a list item.
  - This is another list item.
  - This is a list item with a [link](https://example.com).
    - This is a nested list item.
    - This is another nested list item.
`;

const ast = transform(content);
console.dir(ast, { depth: null });
