import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Transforms } from "slate";
import type { Editor } from "slate";

import type { BlocksStore, TextAlign } from "@/web/components/rich-text/types";
import { baseHandleConvert } from "@/web/components/rich-text/util";

function handleConvertToTextAlign(editor: Editor, align: TextAlign) {
  baseHandleConvert(editor, { type: "text-align", align });
}

function handleEnterKey(editor: Editor) {
  if (!editor.selection) {
    return;
  }

  Transforms.splitNodes(editor, {
    always: true,
  });
}

export const textAlignBlocks: Pick<
  BlocksStore,
  "align-center" | "align-left" | "align-right"
> = {
  "align-left": {
    icon: AlignLeft,
    isInBlocksSelector: true,
    label: "Align left",
    renderElement: (props) => (
      <div className="text-left" {...props.attributes}>
        {props.children}
      </div>
    ),
    matchNode(node) {
      return node.type === "text-align" && node.align === "left";
    },
    handleConvert(editor) {
      handleConvertToTextAlign(editor, "left");
    },
    handleEnterKey,
  },
  "align-center": {
    icon: AlignCenter,
    isInBlocksSelector: true,
    label: "Align center",
    renderElement: (props) => (
      <div className="text-center" {...props.attributes}>
        {props.children}
      </div>
    ),
    matchNode(node) {
      return node.type === "text-align" && node.align === "center";
    },
    handleConvert(editor) {
      handleConvertToTextAlign(editor, "center");
    },
    handleEnterKey,
  },
  "align-right": {
    icon: AlignRight,
    isInBlocksSelector: true,
    label: "Align right",
    renderElement: (props) => (
      <div className="text-right" {...props.attributes}>
        {props.children}
      </div>
    ),
    matchNode(node) {
      return node.type === "text-align" && node.align === "right";
    },
    handleConvert(editor) {
      handleConvertToTextAlign(editor, "right");
    },
    handleEnterKey,
  },
};
