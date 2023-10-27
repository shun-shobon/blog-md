import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./extensions/description-list.ts";
import { Embed } from "./extensions/embed.ts";

declare module "mdast" {
  interface RootContentMap {
    descriptionList: DescriptionList;
    descriptionTerm: DescriptionTerm;
    descriptionDetails: DescriptionDetails;
    embed: Embed;
  }

  interface BlockContentMap {
    descriptionList: DescriptionList;
  }
}
