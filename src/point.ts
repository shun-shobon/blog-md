import type { Point } from "unist";

export function addColumn(point: Point, column: number): Point {
  return {
    line: point.line,
    column: point.column + column,
    offset: point.offset ? point.offset + column : undefined,
  };
}
