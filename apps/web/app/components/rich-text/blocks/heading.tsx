import type { Editor } from "slate";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";

import { baseHandleConvert } from "@/web/components/rich-text/util";
import type { BlocksStore } from "@/web/components/rich-text/types";

/**
 * Common handler for converting a node to a heading
 */
const handleConvertToHeading = (
  editor: Editor,
  level: 1 | 2 | 3 | 4 | 5 | 6,
) => {
  baseHandleConvert(editor, { type: "heading", level });
};

export const headingBlocks: Pick<
  BlocksStore,
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "heading-five"
  | "heading-six"
> = {
  "heading-one": {
    renderElement: (props) => (
      <h1 className="text-5xl font-bold" {...props.attributes}>
        {props.children}
      </h1>
    ),
    icon: Heading1,
    label: "Heading 1",
    handleConvert: (editor) => {
      handleConvertToHeading(editor, 1);
    },
    matchNode: (node) => node.type === "heading" && node.level === 1,
    isInBlocksSelector: true,
    snippets: ["#"],
  },
  "heading-two": {
    renderElement: (props) => (
      <h2 className="text-4xl font-bold" {...props.attributes}>
        {props.children}
      </h2>
    ),
    icon: Heading2,
    label: "Heading 2",
    handleConvert: (editor) => {
      handleConvertToHeading(editor, 2);
    },
    matchNode: (node) => node.type === "heading" && node.level === 2,
    isInBlocksSelector: true,
    snippets: ["##"],
  },
  "heading-three": {
    renderElement: (props) => (
      <h3 className="text-3xl font-bold" {...props.attributes}>
        {props.children}
      </h3>
    ),
    icon: Heading3,
    label: "Heading 3",
    handleConvert: (editor) => {
      handleConvertToHeading(editor, 3);
    },
    matchNode: (node) => node.type === "heading" && node.level === 3,
    isInBlocksSelector: true,
    snippets: ["###"],
  },
  "heading-four": {
    renderElement: (props) => (
      <h4 className="text-2xl font-semibold" {...props.attributes}>
        {props.children}
      </h4>
    ),
    icon: Heading4,
    label: "Heading 4",
    handleConvert: (editor) => {
      handleConvertToHeading(editor, 4);
    },
    matchNode: (node) => node.type === "heading" && node.level === 4,
    isInBlocksSelector: true,
    snippets: ["####"],
  },
  "heading-five": {
    renderElement: (props) => (
      <h5 className="text-xl font-semibold" {...props.attributes}>
        {props.children}
      </h5>
    ),
    icon: Heading5,
    label: "Heading 5",
    handleConvert: (editor) => {
      handleConvertToHeading(editor, 5);
    },
    matchNode: (node) => node.type === "heading" && node.level === 5,
    isInBlocksSelector: true,
    snippets: ["#####"],
  },
  "heading-six": {
    renderElement: (props) => (
      <h6 className="text-lg font-semibold" {...props.attributes}>
        {props.children}
      </h6>
    ),
    icon: Heading6,
    label: "Heading 6",
    handleConvert: (editor) => {
      handleConvertToHeading(editor, 6);
    },
    matchNode: (node) => node.type === "heading" && node.level === 6,
    isInBlocksSelector: true,
    snippets: ["######"],
  },
};
