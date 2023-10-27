import type { Node as UnistNode } from "unist";

export interface Node extends UnistNode {}

export interface Literal extends Node {
  value: string;
}

export interface Parent extends Node {
  children: Array<Content>;
}

export type Content =
  | Text
  | Strong
  | Emphasis
  | Delete
  | InlineCode
  | Link
  | Image
  | Break
  | ThematicBreak
  | Html
  | Heading
  | Paragraph
  | Blockquote
  | UnorderedList
  | OrderedList
  | ListItem
  | DescriptionList
  | DescriptionTerm
  | DescriptionDetails
  | Table
  | TableRow
  | TableCell
  | Code
  | Embed;

export interface Text extends Literal {
  type: "text";
}

export interface Strong extends Parent {
  type: "strong";
}

export interface Emphasis extends Parent {
  type: "emphasis";
}

export interface Delete extends Parent {
  type: "delete";
}

export interface InlineCode extends Literal {
  type: "inlineCode";
}

export interface Link extends Parent {
  type: "link";
  url: string;
  title?: string | undefined;
}

export interface Image extends Node {
  type: "image";
  alt: string;
  url: string;
  title?: string | undefined;
}

export interface Break extends Node {
  type: "break";
}

export interface ThematicBreak extends Node {
  type: "thematicBreak";
}

export interface Html extends Literal {
  type: "html";
}

export interface Heading extends Parent {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  plain: string;
}

export interface Paragraph extends Parent {
  type: "paragraph";
}

export interface Blockquote extends Parent {
  type: "blockquote";
}

export interface UnorderedList extends Parent {
  type: "unorderedList";
}

export interface OrderedList extends Parent {
  type: "orderedList";
}

export interface ListItem extends Parent {
  type: "listItem";
}

export interface DescriptionList extends Parent {
  type: "descriptionList";
}

export interface DescriptionTerm extends Parent {
  type: "descriptionTerm";
}

export interface DescriptionDetails extends Parent {
  type: "descriptionDetails";
}

export interface Table extends Parent {
  type: "table";
  align: Array<"left" | "center" | "right" | null>;
}

export interface TableRow extends Parent {
  type: "tableRow";
}

export interface TableCell extends Parent {
  type: "tableCell";
}

export interface Code extends Literal {
  type: "code";
  lang?: string | undefined;
  filename?: string | undefined;
  diff: boolean;
}

export interface Embed extends Node {
  type: "embed";
  url: string;
}