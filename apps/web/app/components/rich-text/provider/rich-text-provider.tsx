import type { BlocksStore } from "@/web/components/rich-text/types";

import { RichTextContext } from "./util";

export function RichTextProvider({
  children,
  blocks,
}: {
  children: React.ReactNode;
  blocks: BlocksStore;
}) {
  return <RichTextContext value={{ blocks }}>{children}</RichTextContext>;
}
