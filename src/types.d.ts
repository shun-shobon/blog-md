import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./remark/description-list.ts";
import { Embed } from "./remark/embed.ts";

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
