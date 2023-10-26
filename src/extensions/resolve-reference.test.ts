import { fromMarkdown } from "mdast-util-from-markdown";
import { resolveReference } from "./resolve-reference.js";
import { describe, expect, it } from "bun:test";
import { dedent } from "@qnighy/dedent";
import type { Root, RootContent } from "mdast";

export function transform(content: string) {
  return fromMarkdown(content, {
    mdastExtensions: [resolveReference()],
  });
}

describe("resolveReference", () => {
  it("should resolve full `linkReference`", () => {
    const content = dedent`\
      [link][link]

      [link]: https://example.com
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "link",
          children: [
            {
              type: "text",
              value: "link",
              position: {
                start: { line: 1, column: 2, offset: 1 },
                end: { line: 1, column: 6, offset: 5 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 13, offset: 12 },
          },
          url: "https://example.com",
          title: null,
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 13, offset: 12 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should resolve callapsed `linkReference`", () => {
    const content = dedent`\
      [**link** is *awesome*][]

      [**link** is *awesome*]: https://example.com
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "link",
          children: [
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "link",
                  position: {
                    start: { line: 1, column: 4, offset: 3 },
                    end: { line: 1, column: 8, offset: 7 },
                  },
                },
              ],
              position: {
                start: { line: 1, column: 2, offset: 1 },
                end: { line: 1, column: 10, offset: 9 },
              },
            },
            {
              type: "text",
              value: " is ",
              position: {
                start: { line: 1, column: 10, offset: 9 },
                end: { line: 1, column: 14, offset: 13 },
              },
            },
            {
              type: "emphasis",
              children: [
                {
                  type: "text",
                  value: "awesome",
                  position: {
                    start: { line: 1, column: 15, offset: 14 },
                    end: { line: 1, column: 22, offset: 21 },
                  },
                },
              ],
              position: {
                start: { line: 1, column: 14, offset: 13 },
                end: { line: 1, column: 23, offset: 22 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 26, offset: 25 },
          },
          url: "https://example.com",
          title: null,
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 26, offset: 25 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should resolve shortcut `linkReference`", () => {
    const content = dedent`\
      [LiNk]

      [lInK]: https://example.com
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "link",
          children: [
            {
              type: "text",
              value: "LiNk",
              position: {
                start: { line: 1, column: 2, offset: 1 },
                end: { line: 1, column: 6, offset: 5 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 7, offset: 6 },
          },
          url: "https://example.com",
          title: null,
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 7, offset: 6 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should transform `linkReference` to `text` if it can't resolve the reference", () => {
    const content = dedent`\
      [link][invalid]

      [link]: https://example.com
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "[link][invalid]",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 16, offset: 15 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 16, offset: 15 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should transform `linkReference` to PharsingContent if it can't resolve the reference", () => {
    const content = dedent`\
      [**link** is *awesome*][invalid]

      [link]: https://example.com
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "[",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 2, offset: 1 },
          },
        },
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: "link",
              position: {
                start: { line: 1, column: 4, offset: 3 },
                end: { line: 1, column: 8, offset: 7 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 2, offset: 1 },
            end: { line: 1, column: 10, offset: 9 },
          },
        },
        {
          type: "text",
          value: " is ",
          position: {
            start: { line: 1, column: 10, offset: 9 },
            end: { line: 1, column: 14, offset: 13 },
          },
        },
        {
          type: "emphasis",
          children: [
            {
              type: "text",
              value: "awesome",
              position: {
                start: { line: 1, column: 15, offset: 14 },
                end: { line: 1, column: 22, offset: 21 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 14, offset: 13 },
            end: { line: 1, column: 23, offset: 22 },
          },
        },
        {
          type: "text",
          value: "][invalid]",
          position: {
            start: { line: 1, column: 23, offset: 22 },
            end: { line: 1, column: 33, offset: 32 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 33, offset: 32 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });
});
