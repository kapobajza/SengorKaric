import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

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
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
