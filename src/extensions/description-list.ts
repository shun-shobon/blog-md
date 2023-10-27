import type {
  BlockContent,
  DefinitionContent,
  List,
  ListItem,
  Node,
  Parent,
  PhrasingContent,
  Root,
} from "mdast";
import type { Extension } from "mdast-util-from-markdown";
import { isList, isListItem, isParagraph, isText } from "../check.js";
import { visit } from "../visit.js";
import { unreachable } from "../error.js";
import * as O from "../option.js";
import { pipe } from "@shun-shobon/pipes";
import { addColumn } from "../point.js";
import type { Position } from "unist";

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

export function descriptionList(): Extension {
  const transformer = (tree: Root) => {
    visit(tree, isDescriptionListLike, (node, idx, parent) => {
      if (idx === undefined || !parent) unreachable();

      const descriptionChildren = node.children.flatMap((listItem) => {
        const [termLike, ...detailsLikeList] = listItem.children;
        if (!termLike || !isParagraph(termLike)) unreachable();
        if (!detailsLikeList.every(isList)) unreachable();

        const termLikeLastChild = termLike.children.at(-1);
        if (!termLikeLastChild || !isText(termLikeLastChild)) unreachable();

        // termの最後の文字`:`を削除
        termLikeLastChild.value = termLikeLastChild.value.slice(0, -1);
        // termの最後のtextの位置情報を更新
        termLikeLastChild.position = termLikeLastChild.position
          ? {
              start: termLikeLastChild.position.start,
              end: addColumn(termLikeLastChild.position.end, -1),
            }
          : undefined;
        // termの最後のtextが空文字列になった場合は削除
        if (termLikeLastChild.value.length === 0) {
          termLike.children.pop();
        }

        const termPosition: Position | undefined =
          listItem.position && termLike.position
            ? {
                start: listItem.position.start,
                end: termLike.position.end,
              }
            : undefined;

        const descriptionTerm: DescriptionTerm = {
          type: "descriptionTerm",
          children: termLike.children,
          position: termPosition,
        };

        const descriptionDetails: Array<DescriptionDetails> = detailsLikeList
          .flatMap((details) => details.children)
          .map((details) => {
            return {
              type: "descriptionDetails",
              children: details.children,
              position: details.position,
            };
          });

        return [descriptionTerm, ...descriptionDetails];
      });

      const descriptionList: DescriptionList = {
        type: "descriptionList",
        children: descriptionChildren,
        position: node.position,
      };

      parent.children[idx] = descriptionList;
    });
  };

  return {
    transforms: [transformer],
  };
}

function isDescriptionListLike(node: Node): node is List {
  if (!isList(node)) return false;
  if (node.ordered) return false;

  if (!node.children.every(isDescriptionTermLike)) return false;

  // 最後の要素はdetailsを1つ以上持っている必要がある(dtで終わることはない)
  const lastChild = node.children.at(-1);
  if (!lastChild) return false;

  const [_term, ...details] = lastChild.children;
  if (details.length === 0) return false;

  return true;
}

function isDescriptionTermLike(node: Node): node is ListItem {
  if (!isListItem(node)) return false;

  const [term, ...detailsList] = node.children;
  if (!term || !isParagraph(term)) return false;
  if (!detailsList.every((l) => isList(l) && !l.ordered)) return false;

  const termLastChild = term.children.at(-1);
  if (!termLastChild || !isText(termLastChild)) return false;

  const termLastChildText = termLastChild.value;
  return termLastChildText.endsWith(":") && !termLastChildText.endsWith("\\:");
}
