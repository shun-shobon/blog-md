import type { Literal, Node, Parent } from "./ast.js";

export function astToString(...nodes: Array<Node>): string {
  return nodesToString(nodes);
}

function nodeToString(node: Node): string {
  if (isParent(node)) {
    return nodesToString(node.children);
  }

  if (isLiteral(node) && ["text", "inlineCode"].includes(node.type)) {
    return node.value;
  }

  return "";
}

function nodesToString(nodes: Array<Node>): string {
  return nodes.map(nodeToString).join("");
}

function isLiteral(node: Node): node is Literal {
  return "value" in node;
}

function isParent(node: Node): node is Parent {
  return "children" in node;
}
