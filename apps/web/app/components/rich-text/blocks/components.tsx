import type { RenderElementProps } from "slate-react";

import { isListNode } from "@/web/components/rich-text/util";

const orderedStyles = ["decimal", "lower-alpha", "upper-roman"];
const unorderedStyles = ["disc", "circle", "square"];
const listClasses = "flex flex-col gap-1 ms-0 me-0 ps-2 [&>li]:ms-3";

export const List = ({ attributes, children, element }: RenderElementProps) => {
  if (!isListNode(element)) {
    return null;
  }

  // Decide the subsequent style by referencing the given styles according to the format,
  // allowing for infinite nested lists
  const listStyles =
    element.format === "ordered" ? orderedStyles : unorderedStyles;
  const nextIndex = (element.indentLevel || 0) % listStyles.length;
  const listStyle: React.CSSProperties = {
    listStyleType: listStyles[nextIndex],
    marginBlockStart: 0,
    marginBlockEnd: 0,
  };

  if (element.format === "ordered") {
    return (
      <ol style={listStyle} className={listClasses} {...attributes}>
        {children}
      </ol>
    );
  }

  return (
    <ul style={listStyle} className={listClasses} {...attributes}>
      {children}
    </ul>
  );
};
