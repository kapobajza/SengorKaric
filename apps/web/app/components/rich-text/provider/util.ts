import { createContext, useContext } from "react";
import { useSlate } from "slate-react";

import type { BlocksStore } from "@/web/components/rich-text/types";

export type RichTextContext = {
  blocks: BlocksStore;
};

export const RichTextContext = createContext<RichTextContext | undefined>(
  undefined,
);

export function useRichText() {
  const context = useContext(RichTextContext);
  const editor = useSlate();

  if (!context) {
    throw new Error("useRichText must be used within a RichTextProvider");
  }

  return {
    ...context,
    editor,
  };
}
