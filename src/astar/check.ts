import * as Astar from "./ast.js";

export function isSection(node: Astar.Node): node is Astar.Section {
  return node.type === "section";
}
