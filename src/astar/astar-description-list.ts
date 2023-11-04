import type { Plugin } from "unified";

import type {
  DescriptionDetails as MdastDescriptionDetails,
  DescriptionList as MdastDescriptionList,
  DescriptionTerm as MdastDescriptionTerm,
} from "../remark/remark-description-list.js";
import type {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./ast.js";
import type { Handler } from "./astar-transform.js";

export const astarDescriptionList: Plugin = function () {
  const data = this.data();

  data.astarFromMdastHandlers ??= {};
  data.astarFromMdastHandlers["descriptionList"] = descriptionList;
  data.astarFromMdastHandlers["descriptionTerm"] = descriptionTerm;
  data.astarFromMdastHandlers["descriptionDetails"] = descriptionDetails;
};

const descriptionList: Handler<MdastDescriptionList> = (
  node,
  state,
): DescriptionList | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "descriptionList",
    children,
    position: node.position,
  };
};

const descriptionTerm: Handler<MdastDescriptionTerm> = (
  node,
  state,
): DescriptionTerm | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "descriptionTerm",
    children,
    position: node.position,
  };
};

const descriptionDetails: Handler<MdastDescriptionDetails> = (
  node,
  state,
): DescriptionDetails | undefined => {
  const children = state.transformAll(node);
  if (children.length === 0) return;

  return {
    type: "descriptionDetails",
    children,
    position: node.position,
  };
};
