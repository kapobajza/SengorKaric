import { Editor, Node, Transforms } from "slate";
import type { Element, Path, Text } from "slate";

import { selectorBlockKeys } from "./types";
import type { LinkInlineNode, ListBlockNode, SelectorBlockKey } from "./types";

export const isSelectorBlockKey = (key: unknown): key is SelectorBlockKey => {
  return (
    typeof key === "string" &&
    selectorBlockKeys.includes(key as SelectorBlockKey)
  );
};

/**
 * Set all attributes except type and children to null so that Slate deletes them
 */
export const getAttributesToClear = (element: Element) => {
  const { children: _children, type: _type, ...extra } = element;

  const attributesToClear = Object.keys(extra).reduce(
    (currentAttributes, key) => ({ ...currentAttributes, [key]: null }),
    {},
  );

  return attributesToClear as Record<string, null>;
};

/**
 * Extracts some logic that is common to most blocks' handleConvert functions.
 * @returns The path of the converted block
 */
export const baseHandleConvert = <T extends Element>(
  editor: Editor,
  attributesToSet: Partial<T> & { type: T["type"] },
): Path | undefined => {
  // If there is no selection, convert last inserted node
  const [_, lastNodePath] = Editor.last(editor, []);

  // If the selection is inside a list, split the list so that the modified block is outside of it
  Transforms.unwrapNodes(editor, {
    match: (node) => !Editor.isEditor(node) && node.type === "list",
    split: true,
    at: editor.selection ?? lastNodePath,
  });

  // Make sure we get a block node, not an inline node
  const [, updatedLastNodePath] = Editor.last(editor, []);
  const entry = Editor.above(editor, {
    match: (node) =>
      !Editor.isEditor(node) && node.type !== "text" && node.type !== "link",
    at: editor.selection ?? updatedLastNodePath,
  });

  if (!entry || Editor.isEditor(entry[0])) {
    return;
  }

  const [element, elementPath] = entry;

  Transforms.setNodes(
    editor,
    {
      ...getAttributesToClear(element),
      ...attributesToSet,
    } as Partial<Element>,
    { at: elementPath },
  );

  return elementPath;
};

export const isLinkNode = (element: Element): element is LinkInlineNode => {
  return element.type === "link";
};

export const isListNode = (element: Element): element is ListBlockNode => {
  return element.type === "list";
};

export const isText = (node: unknown): node is Text => {
  return Node.isNode(node) && !Editor.isEditor(node) && node.type === "text";
};

/**
 * Inserts a line break the first time the user presses enter, and exits the node the second time.
 */
export const pressEnterTwiceToExit = (editor: Editor) => {
  /**
   * To determine if we should break out of the node, check 2 things:
   * 1. If the cursor is at the end of the node
   * 2. If the last line of the node is empty
   */
  const nodeEntry = Editor.above(editor, {
    match: (node) =>
      !Editor.isEditor(node) && !["link", "text"].includes(node.type),
  });
  if (!nodeEntry || !editor.selection) {
    return;
  }
  const [node, nodePath] = nodeEntry;
  const isNodeEnd = Editor.isEnd(editor, editor.selection.anchor, nodePath);
  const lastTextNode = node.children.at(-1);
  const isEmptyLine = isText(lastTextNode) && lastTextNode.text.endsWith("\n");

  if (isNodeEnd && isEmptyLine) {
    // Remove the last line break
    Transforms.delete(editor, {
      distance: 1,
      unit: "character",
      reverse: true,
    });
    // Break out of the node by creating a new paragraph
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [{ type: "text", text: "" }],
    });
    return;
  }

  // Otherwise insert a new line within the node
  Transforms.insertText(editor, "\n");

  // If there's nothing after the cursor, disable modifiers
  if (isNodeEnd) {
    ["bold", "italic", "underline", "strikethrough", "code"].forEach(
      (modifier) => {
        Editor.removeMark(editor, modifier);
      },
    );
  }
};
