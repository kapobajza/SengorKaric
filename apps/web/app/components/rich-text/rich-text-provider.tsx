import { createContext, useContext } from "react";
import { useSlate } from "slate-react";

import type { BlocksStore } from "./types";

type RichTextContext = {
  blocks: BlocksStore;
};

const RichTextContext = createContext<RichTextContext | undefined>(undefined);

export function RichTextProvider({
  children,
  blocks,
}: {
  children: React.ReactNode;
  blocks: BlocksStore;
}) {
  return <RichTextContext value={{ blocks }}>{children}</RichTextContext>;
}

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
