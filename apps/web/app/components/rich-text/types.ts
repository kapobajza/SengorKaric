import type { Editor } from "slate";
import type { RenderElementProps } from "slate-react";

type TextInlineNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type BaseNode = {
  type: string;
  children: unknown[];
};

type InlineNode = TextInlineNode | LinkInlineNode | ListItemInlineNode;
export type DefaultInlineNode = Exclude<InlineNode, ListItemInlineNode>;
type NonTextInlineNode = Exclude<InlineNode, TextInlineNode>;

export type LinkInlineNode = {
  type: "link";
  url: string;
  children: TextInlineNode[];
} & BaseNode;

type ListItemInlineNode = {
  type: "list-item";
  children: (TextInlineNode | LinkInlineNode)[];
} & BaseNode;

type ParagraphBlockNode = {
  type: "paragraph";
  children: DefaultInlineNode[];
} & BaseNode;

type QuoteBlockNode = {
  type: "quote";
  children: DefaultInlineNode[];
} & BaseNode;

type CodeBlockNode = {
  type: "code";
  language?: string;
  children: DefaultInlineNode[];
} & BaseNode;

type HeadingBlockNode = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: DefaultInlineNode[];
} & BaseNode;

export type TextAlign = "left" | "center" | "right";

export type TextAlignBlockNode = {
  type: "text-align";
  align: TextAlign;
  children: DefaultInlineNode[];
} & BaseNode;

export type ListBlockFormat = "ordered" | "unordered";

export type ListBlockNode = {
  type: "list";
  format: ListBlockFormat;
  children: (ListItemInlineNode | ListBlockNode)[];
  indentLevel?: number;
} & BaseNode;

type RootNode =
  | ParagraphBlockNode
  | QuoteBlockNode
  | CodeBlockNode
  | HeadingBlockNode
  | ListBlockNode
  | TextAlignBlockNode;

export type BlocksValue = RootNode[];

// Type utils needed for the blocks renderer and the blocks editor
export type BlocksNode = RootNode | NonTextInlineNode;
export type BlocksInlineNode = NonTextInlineNode;
export type BlocksTextNode = TextInlineNode;

type BaseBlock = {
  renderElement: (props: RenderElementProps) => React.JSX.Element;
  matchNode: (node: BlocksNode) => boolean;
  handleConvert?: ((editor: Editor) => void) | (() => React.JSX.Element);
  handleEnterKey?: (editor: Editor) => void;
  handleBackspaceKey?: (
    editor: Editor,
    event: React.KeyboardEvent<HTMLElement>,
  ) => void;
  handleTab?: (editor: Editor) => void;
  snippets?: string[];
};

type NonSelectorBlock = {
  isInBlocksSelector: false;
} & BaseBlock;

type SelectorBlock = {
  isInBlocksSelector: true;
  icon: React.ComponentType;
  label: string;
} & BaseBlock;

// TODO: Add "link" block
// type NonSelectorBlockKey = "list-item" | "link";
type NonSelectorBlockKey = "list-item";

export const selectorBlockKeys = [
  "paragraph",
  "heading-one",
  "heading-two",
  "heading-three",
  "heading-four",
  "heading-five",
  "heading-six",
  "list-ordered",
  "list-unordered",
  "quote",
  "align-left",
  "align-center",
  "align-right",
] as const;

export type SelectorBlockKey = (typeof selectorBlockKeys)[number];

export type BlocksStore = {
  [K in SelectorBlockKey]: SelectorBlock;
} & {
  [K in NonSelectorBlockKey]: NonSelectorBlock;
};
