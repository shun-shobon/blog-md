import type {
  BlockContent,
  DefinitionContent,
  Parent,
  PhrasingContent,
} from "mdast";

export interface DescriptionList extends Parent {
  type: "descriptionList";
  children: Array<DescriptionContent>;
}

export interface DescriptionTerm extends Parent {
  type: "descriptionTerm";
  children: Array<PhrasingContent>;
}

export interface DescriptionDetails extends Parent {
  type: "descriptionDetails";
  children: Array<BlockContent | DefinitionContent>;
}

export interface DescriptionContentMap {
  descriptionTerm: DescriptionTerm;
  descriptionDetails: DescriptionDetails;
}
export type DescriptionContent =
  DescriptionContentMap[keyof DescriptionContentMap];
