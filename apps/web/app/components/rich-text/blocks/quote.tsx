import { TextQuote } from "lucide-react";

import type { BlocksStore } from "@/web/components/rich-text/types";
import {
  baseHandleConvert,
  pressEnterTwiceToExit,
} from "@/web/components/rich-text/util";

export const quoteBlocks: Pick<BlocksStore, "quote"> = {
  quote: {
    renderElement: (props) => (
      // The div is needed to make sure the padding bottom from BlocksContent is applied properly
      // when the quote is the last block in the editor
      <blockquote
        {...props.attributes}
        className="border-l-4 border-gray-200 px-4 py-2 text-gray-600"
      >
        {props.children}
      </blockquote>
    ),
    icon: TextQuote,
    label: "Quote",
    matchNode: (node) => node.type === "quote",
    isInBlocksSelector: true,
    handleConvert(editor) {
      baseHandleConvert(editor, { type: "quote" });
    },
    handleEnterKey(editor) {
      pressEnterTwiceToExit(editor);
    },
    snippets: [">"],
  },
};
