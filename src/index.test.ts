import { describe, expect, test } from "bun:test";
import { transform } from "./index.js";
import type { Root } from "mdast";

describe("transform()", () => {
  test("basic", () => {
    const content = "Hello, world!";

    const actural = transform(content);
    const expected = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: "Hello, world!",
              position: {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 14, offset: 13 },
              },
            },
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 14, offset: 13 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 14, offset: 13 },
      },
    } satisfies Root;

    expect(actural).toEqual(expected);
  });
});
