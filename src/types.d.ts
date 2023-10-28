import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./parse/extensions/description-list.ts";
import { Embed } from "./parse/extensions/embed.ts";

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
