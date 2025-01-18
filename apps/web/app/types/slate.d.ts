import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

import type {
  BlocksInlineNode,
  BlocksNode,
  BlocksTextNode,
  BlocksValue,
} from "@/web/components/rich-text/types";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type SlateParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type SlateAudioElement = {
  type: "audio";
  src: string;
  children: CustomText[];
};

export type CustomElement = SlateParagraphElement | SlateAudioElement;

export type FormattedText = { text: string; bold?: true };

export type CustomText = FormattedText;

declare module "slate" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypes {
    Editor: Omit<BaseEditor & ReactEditor & HistoryEditor, "children"> & {
      children: BlocksValue;
    };
    Element: BlocksNode;
    Descendant: BlocksInlineNode | Text;
    Text: BlocksTextNode;
  }
}
