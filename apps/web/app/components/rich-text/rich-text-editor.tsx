import React from "react";
import { createEditor } from "slate";
import type { Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

import { RichTextToolbar } from "./toolbar/rich-text-toolbar";
import { RichTextContent } from "./rich-text-content";
import { RichTextProvider } from "./provider/rich-text-provider";
import type { BlocksStore } from "./types";
import { paragraphBlocks } from "./blocks/paragraph";
import { headingBlocks } from "./blocks/heading";
import { listBlocks } from "./blocks/list";
import { quoteBlocks } from "./blocks/quote";
import { audioBlocks } from "./blocks/audio";
import { withNormalization } from "./plugins/with-normalization";

type Props = {
  initialValue?: Descendant[];
};

const blocks: BlocksStore = {
  ...paragraphBlocks,
  ...headingBlocks,
  ...listBlocks,
  ...quoteBlocks,
  ...audioBlocks,
};

export function RichTextEditor({ initialValue }: Props) {
  const [editor] = React.useState(() => {
    const editor = withNormalization(withHistory(withReact(createEditor())));
    return editor;
  });

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
        <RichTextToolbar />
        <RichTextContent />
      </RichTextProvider>
    </Slate>
  );
}
