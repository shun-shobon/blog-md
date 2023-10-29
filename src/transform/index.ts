import type * as Mdast from "mdast";

import type * as AST from "../ast.js";
import type { After, Before, Extension, MdastHandler } from "./extension.js";

export type Option = {
  extensions?: Array<Extension>;
};

export function transform(tree: Mdast.Root, option?: Option): AST.Root {
  const { before, handlers, rootData, after } = mergeExtensions(
    option?.extensions ?? [],
  );

  const handleNode = (node: Mdast.Node): AST.Content | undefined => {
    const handler = handlers[node.type];
    if (!handler) throw new Error(`Cannot handle node type: ${node.type}`);

    return handler(node, handleChildren);
  };
  const handleChildren = (node: Mdast.Parent): Array<AST.Content> => {
    return node.children
      .map((n) => handleNode(n))
      .filter((n): n is AST.Content => n !== undefined);
  };

  before(tree);

  const children = handleChildren(tree);

  const data = rootData();

  const root: AST.Root = {
    type: "root",
    children,
    position: tree.position,
    ...data,
  };

  after(root);

  return root;
}

function mergeExtensions(extensions: Array<Extension>): Required<Extension> {
  const beforeFuncs = extensions
    .map((ext) => ext.before)
    .filter((b): b is Before => b !== undefined);
  const before: Before = (tree) => {
    beforeFuncs.forEach((before) => before(tree));
  };

  const handlers = extensions
    .map((ext) => ext.handlers)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((h): h is Record<string, MdastHandler<any>> => h !== undefined)
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});

  const rootDataFuncs = extensions
    .map((ext) => ext.rootData)
    .filter((r): r is () => AST.RootData => r !== undefined);
  const rootData = (): AST.RootData => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return rootDataFuncs.reduce((prev, curr) => ({ ...prev, ...curr() }), {});
  };

  const afterFuncs = extensions
    .map((ext) => ext.after)
    .filter((a): a is After => a !== undefined);
  const after: After = (tree) => {
    afterFuncs.forEach((after) => after(tree));
  };

  return { before, handlers, rootData, after };
}
