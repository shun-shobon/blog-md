import { dedent } from "@qnighy/dedent";
import { describe, expect, it } from "bun:test";
import type { RootContent } from "mdast";

import { parse } from "../index.js";

describe("descriptionList", () => {
  it("should transform `list` to `descriptionList`", () => {
    const content = dedent`\
      - term 1:
        - details 1
        - details 2
      - term 2:
        - details 3
    `;

    const actual = parse(content).children[0];
    const expected = {
      type: "descriptionList",
      children: [
        {
          type: "descriptionTerm",
          children: [
            {
              type: "text",
              value: "term 1",
              position: {
                start: { line: 1, column: 3, offset: 2 },
                end: { line: 1, column: 9, offset: 8 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 10, offset: 9 },
          },
        },
        {
          type: "descriptionDetails",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "details 1",
                  position: {
                    start: { line: 2, column: 5, offset: 14 },
                    end: { line: 2, column: 14, offset: 23 },
                  },
                },
              ],
              position: {
                start: { line: 2, column: 5, offset: 14 },
                end: { line: 2, column: 14, offset: 23 },
              },
            },
          ],
          position: {
            start: { line: 2, column: 3, offset: 12 },
            end: { line: 2, column: 14, offset: 23 },
          },
        },
        {
          type: "descriptionDetails",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "details 2",
                  position: {
                    start: { line: 3, column: 5, offset: 28 },
                    end: { line: 3, column: 14, offset: 37 },
                  },
                },
              ],
              position: {
                start: { line: 3, column: 5, offset: 28 },
                end: { line: 3, column: 14, offset: 37 },
              },
            },
          ],
          position: {
            start: { line: 3, column: 3, offset: 26 },
            end: { line: 3, column: 14, offset: 37 },
          },
        },
        {
          type: "descriptionTerm",
          children: [
            {
              type: "text",
              value: "term 2",
              position: {
                start: { line: 4, column: 3, offset: 40 },
                end: { line: 4, column: 9, offset: 46 },
              },
            },
          ],
          position: {
            start: { line: 4, column: 1, offset: 38 },
            end: { line: 4, column: 10, offset: 47 },
          },
        },
        {
          type: "descriptionDetails",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "details 3",
                  position: {
                    start: { line: 5, column: 5, offset: 52 },
                    end: { line: 5, column: 14, offset: 61 },
                  },
                },
              ],
              position: {
                start: { line: 5, column: 5, offset: 52 },
                end: { line: 5, column: 14, offset: 61 },
              },
            },
          ],
          position: {
            start: { line: 5, column: 3, offset: 50 },
            end: { line: 5, column: 14, offset: 61 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 5, column: 14, offset: 61 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should transform `list` to `descriptionList` with multiple terms", () => {
    const content = dedent`\
      - term 1:
      - term 2:
        - details 1
        - details 2
    `;

    const actual = parse(content).children[0];
    const expected = {
      type: "descriptionList",
      children: [
        {
          type: "descriptionTerm",
          children: [
            {
              type: "text",
              value: "term 1",
              position: {
                start: { line: 1, column: 3, offset: 2 },
                end: { line: 1, column: 9, offset: 8 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 10, offset: 9 },
          },
        },
        {
          type: "descriptionTerm",
          children: [
            {
              type: "text",
              value: "term 2",
              position: {
                start: { line: 2, column: 3, offset: 12 },
                end: { line: 2, column: 9, offset: 18 },
              },
            },
          ],
          position: {
            start: { line: 2, column: 1, offset: 10 },
            end: { line: 2, column: 10, offset: 19 },
          },
        },
        {
          type: "descriptionDetails",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "details 1",
                  position: {
                    start: { line: 3, column: 5, offset: 24 },
                    end: { line: 3, column: 14, offset: 33 },
                  },
                },
              ],
              position: {
                start: { line: 3, column: 5, offset: 24 },
                end: { line: 3, column: 14, offset: 33 },
              },
            },
          ],
          position: {
            start: { line: 3, column: 3, offset: 22 },
            end: { line: 3, column: 14, offset: 33 },
          },
        },
        {
          type: "descriptionDetails",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "details 2",
                  position: {
                    start: { line: 4, column: 5, offset: 38 },
                    end: { line: 4, column: 14, offset: 47 },
                  },
                },
              ],
              position: {
                start: { line: 4, column: 5, offset: 38 },
                end: { line: 4, column: 14, offset: 47 },
              },
            },
          ],
          position: {
            start: { line: 4, column: 3, offset: 36 },
            end: { line: 4, column: 14, offset: 47 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 4, column: 14, offset: 47 },
      },
    } satisfies RootContent;

    expect(actual).toEqual(expected);
  });

  it("should not transform `list` to `descriptionList` if last term has not details", () => {
    const content = dedent`\
      - term 1:
        - details 1
      - term 2:
        - details 2
      - term 3:
    `;

    const actual = parse(content).children[0];

    expect(actual?.type).toBe("list");
  });
});
