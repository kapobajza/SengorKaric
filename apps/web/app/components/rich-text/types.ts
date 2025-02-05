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
  className?: string;
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

export type ParagraphBlockNode = {
  type: "paragraph";
  children: DefaultInlineNode[];
} & BaseNode;

type QuoteBlockNode = {
  type: "quote";
  children: DefaultInlineNode[];
} & BaseNode;

export type HeadingBlockNode = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: DefaultInlineNode[];
} & BaseNode;

export type AudioBlockNode = {
  type: "audio";
  src: string;
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

export type RootNode =
  | ParagraphBlockNode
  | QuoteBlockNode
  | HeadingBlockNode
  | ListBlockNode
  | AudioBlockNode;

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
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "list-ordered",
  "list-unordered",
  "quote",
  "audio",
] as const;

export type SelectorBlockKey = (typeof selectorBlockKeys)[number];

export type BlocksStore = {
  [K in SelectorBlockKey]: SelectorBlock;
} & {
  [K in NonSelectorBlockKey]: NonSelectorBlock;
};

export type RichTextSelectedDropdownNode = {
  label: string;
  value: Extract<
    SelectorBlockKey,
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "paragraph"
  >;
};

export const RichTextSelectedDropdownNodeMap = {
  paragraph: {
    label: "Text",
    value: "paragraph",
  },
  "heading-1": {
    label: "Heading 1",
    value: "heading-1",
  },
  "heading-2": {
    label: "Heading 2",
    value: "heading-2",
  },
  "heading-3": {
    label: "Heading 3",
    value: "heading-3",
  },
  "heading-4": {
    label: "Heading 4",
    value: "heading-4",
  },
  "heading-5": {
    label: "Heading 5",
    value: "heading-5",
  },
  "heading-6": {
    label: "Heading 6",
    value: "heading-6",
  },
} as const satisfies Record<
  RichTextSelectedDropdownNode["value"],
  RichTextSelectedDropdownNode
>;

export type RichTextSelectedDropdownNodeMap =
  typeof RichTextSelectedDropdownNodeMap;
