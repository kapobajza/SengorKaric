import React from "react";
import { createEditor } from "slate";
import type { Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

import { RichTextToolbar } from "./rich-text-toolbar";
import { RichTextContent } from "./rich-text-content";
import { RichTextProvider } from "./rich-text-provider";
import type { BlocksStore } from "./types";
import { paragraphBlocks } from "./blocks/paragraph";
import { headingBlocks } from "./blocks/heading";
import { listBlocks } from "./blocks/list";
import { quoteBlocks } from "./blocks/quote";

type Props = {
  initialValue?: Descendant[];
};

// TODO: add link block
const blocks: BlocksStore = {
  ...paragraphBlocks,
  ...headingBlocks,
  ...listBlocks,
  ...quoteBlocks,
};

export function RichTextEditor({ initialValue }: Props) {
  const [editor] = React.useState(() => withHistory(withReact(createEditor())));

  return (
    <Slate
      editor={editor}
      initialValue={
        initialValue ?? [
          { type: "paragraph", children: [{ type: "text", text: "" }] },
        ]
      }
    >
      <RichTextProvider blocks={blocks}>
        <RichTextToolbar className="mb-4" />
        <RichTextContent />
      </RichTextProvider>
    </Slate>
  );
}
