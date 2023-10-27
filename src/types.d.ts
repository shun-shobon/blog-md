import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./extensions/description-list.ts";

declare module "mdast" {
  interface RootContentMap {
    descriptionList: DescriptionList;
    descriptionTerm: DescriptionTerm;
    descriptionDetails: DescriptionDetails;
  }

  interface BlockContentMap {
    descriptionList: DescriptionList;
  }
}
