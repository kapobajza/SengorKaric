import { Element, Node, Transforms } from "slate";
import type { Editor } from "slate";

export const withNormalization = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (Element.isElement(node) && node.type === "list") {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && child.type !== "list-item") {
          Transforms.setNodes(editor, { type: "list-item" }, { at: childPath });
          return;
        }
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};
