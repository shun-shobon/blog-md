import type { Plugin } from "unified";
import * as v from "valibot";

import type { Root } from "./ast.js";

const Frontmatter = v.object({
  emoji: v.string('Value of "emoji" must be a string.'),
  tags: v.array(v.string(), 'Value of "tags" must be an array of strings.'),
  published: v.boolean('Value of "published" must be a boolean.'),
  publishedAt: v.string('Value of "publishedAt" must be a date.'),
});
type Frontmatter = v.Input<typeof Frontmatter>;

interface Article extends Omit<Root, "type">, Frontmatter {
  type: "article";
}

export const astarArticle: Plugin<Array<never>, Root, Article> = function () {
  return (tree) => {
    const rawFrontmatter = this.data("frontmatter");

    let frontmatter: Frontmatter;
    try {
      frontmatter = v.parse(Frontmatter, rawFrontmatter);
    } catch (error) {
      return new Error("Cannot parse frontmatter.", { cause: error });
    }

    const article: Article = {
      ...tree,
      ...frontmatter,
      type: "article",
    };

    return article;
  };
};
