import type { Plugin } from "unified";
import * as v from "valibot";

import type { Heading, Root, Section } from "./ast.js";
import type { Toc } from "./astar-toc.js";
import { isSection } from "./check.js";

const Frontmatter = v.object({
  emoji: v.string('Value of "emoji" must be a string.'),
  tags: v.array(v.string(), 'Value of "tags" must be an array of strings.'),
  published: v.boolean('Value of "published" must be a boolean.'),
  publishedAt: v.string('Value of "publishedAt" must be a date.'),
});
type Frontmatter = v.Input<typeof Frontmatter>;

export interface Article extends Omit<Root, "type">, Frontmatter {
  type: "article";
  title: Heading;
  toc: Array<Toc>;
}

export const astarArticle: Plugin<Array<never>, Root, Article> = function () {
  return (tree) => {
    const rawFrontmatter = this.data("frontmatter");
    const frontmatter = v.parse(Frontmatter, rawFrontmatter);

    assertValidSectioning(tree);
    const [section] = tree.children;
    const [title, ...children] = section.children;

    const rawToc = this.data("toc");
    assertValidToc(rawToc);
    const [{ children: toc }] = rawToc;

    const article: Article = {
      type: "article",
      title,
      emoji: frontmatter.emoji,
      tags: frontmatter.tags,
      published: frontmatter.published,
      publishedAt: frontmatter.publishedAt,
      footnotes: tree.footnotes,
      toc,
      children,
    };

    return article;
  };
};

interface ValidSectioning extends Root {
  children: [Section];
}

function assertValidSectioning(tree: Root): asserts tree is ValidSectioning {
  const [section] = tree.children;
  if (!section || !isSection(section))
    throw new Error(
      "Invalid sectioning: you must have exactly one level-1 heading.",
    );

  if (section.children[0].level !== 1)
    throw new Error(
      "Invalid sectioning: you must start with a level-1 heading.",
    );
}

function assertValidToc(toc: Array<Toc> | undefined): asserts toc is [Toc] {
  if (!toc || toc.length !== 1)
    throw new Error(
      "Invalid table of contents: you must have exactly one top-level section.",
    );
}
