import type * as AST from "../../ast.js";
import type {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../../remark/description-list.js";
import type { Extension, MdastHandler } from "../extension.js";

export function descriptionList(): Extension {
  return {
    handlers: {
      descriptionList: descriptionListNode,
      descriptionTerm,
      descriptionDetails,
    },
  };
}

const descriptionListNode: MdastHandler<DescriptionList> = (
  node,
  handleChildren,
) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.DescriptionList = {
    type: "descriptionList",
    children,
    position: node.position,
  };

  return newNode;
};

const descriptionTerm: MdastHandler<DescriptionTerm> = (
  node,
  handleChildren,
) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.DescriptionTerm = {
    type: "descriptionTerm",
    children,
    position: node.position,
  };

  return newNode;
};

const descriptionDetails: MdastHandler<DescriptionDetails> = (
  node,
  handleChildren,
) => {
  const children = handleChildren(node);
  if (children.length === 0) return;

  const newNode: AST.DescriptionDetails = {
    type: "descriptionDetails",
    children,
    position: node.position,
  };

  return newNode;
};
