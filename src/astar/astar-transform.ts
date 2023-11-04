import type * as Mdast from "mdast";
import type { Plugin } from "unified";

import type * as Astar from "./ast.js";

declare module "unified" {
  interface Data {
    astarFromMdastHandlers?: Handlers;
  }
}

export const astarTransform: Plugin<
  Array<never>,
  Mdast.Root,
  Astar.Root
> = function () {
  return (tree) => {
    const additionalHandlers = this.data("astarFromMdastHandlers") ?? {};
    const state = createState(additionalHandlers);

    const children = state.transformAll(tree);

    const root: Astar.Root = {
      type: "root",
      children,
      position: tree.position,
    };

    return root;
  };
};

interface State {
  transformOne: (node: Mdast.Node) => Astar.Content | undefined;
  transformAll: (node: Mdast.Parent) => Array<Astar.Content>;
}

export type Handler<T extends Mdast.Node> = (
  node: T,
  state: State,
) => Astar.Content | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handlers = Record<string, Handler<any>>;

function createState(additionalHandlers: Handlers): State {
  const handlers: Handlers = { ...additionalHandlers };

  const transformOne = (node: Mdast.Node): Astar.Content | undefined => {
    const handler = handlers[node.type];
    if (!handler) throw new Error(`Cannot handle node type: ${node.type}`);

    return handler(node, state);
  };

  const transformAll = (node: Mdast.Parent): Array<Astar.Content> => {
    return node.children
      .map((n) => transformOne(n))
      .filter((n): n is Astar.Content => n !== undefined);
  };

  const state: State = {
    transformOne,
    transformAll,
  };

  return state;
}
