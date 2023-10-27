import { dedent } from "@qnighy/dedent";
import { describe, expect, it } from "bun:test";
import type { Root, RootContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";

import { resolveReference } from "./resolve-reference.js";

export function transform(content: string): Root {
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

  it("should resolve full `linkReference` with title", () => {
    const content = dedent`\
      [link][link]

      [link]: https://example.com "title"
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
          title: "title",
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 13, offset: 12 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should resolve full `imageReference`", () => {
    const content = dedent`\
      ![image][image]

      [image]: https://example.com/image
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "image",
          alt: "image",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 16, offset: 15 },
          },
          url: "https://example.com/image",
          title: null,
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 16, offset: 15 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should resolve callapsed `linkReference`", () => {
    const content = dedent`\
      ![**image** is *awesome*][]

      [**image** is *awesome*]: https://example.com/image
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "image",
          alt: "image is awesome",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 28, offset: 27 },
          },
          url: "https://example.com/image",
          title: null,
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 28, offset: 27 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should resolve shortcut `linkReference`", () => {
    const content = dedent`\
      ![ImAgE]

      [iMaGe]: https://example.com/image
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "image",
          alt: "ImAgE",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 9, offset: 8 },
          },
          url: "https://example.com/image",
          title: null,
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 9, offset: 8 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should resolve full `imageReference` with title", () => {
    const content = dedent`\
      ![image][image]

      [image]: https://example.com/image "title"
    `;

    const actual = transform(content).children[0];
    const expected = {
      type: "paragraph",
      children: [
        {
          type: "image",
          alt: "image",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 16, offset: 15 },
          },
          url: "https://example.com/image",
          title: "title",
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 16, offset: 15 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });
});
