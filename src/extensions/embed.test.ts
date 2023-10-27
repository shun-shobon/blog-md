import { dedent } from "@qnighy/dedent";
import { describe, expect, it } from "bun:test";
import type { List, Root, RootContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmAutolinkLiteralFromMarkdown } from "mdast-util-gfm-autolink-literal";
import { gfmAutolinkLiteral } from "micromark-extension-gfm-autolink-literal";

import { embed } from "./embed.js";

function transform(content: string): Root {
  return fromMarkdown(content, {
    extensions: [gfmAutolinkLiteral()],
    mdastExtensions: [gfmAutolinkLiteralFromMarkdown(), embed()],
  });
}

describe("embed", () => {
  it("should transform orphan `link` to `embed`", () => {
    const content = dedent`\
      https://example.com
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "embed",
      value: "https://example.com",
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 20, offset: 19 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should not transform `link` to `embed` if parent is not `root`", () => {
    const content = dedent`\
      - https://example.com
    `;

    const actual = (transform(content).children[0] as List).children[0];

    expect(actual?.type).not.toBe("embed");
  });
});
