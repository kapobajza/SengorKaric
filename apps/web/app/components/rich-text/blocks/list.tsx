import { ReactEditor } from "slate-react";
import { Editor, Path, Transforms } from "slate";
import { List as BulletList, ListOrdered } from "lucide-react";

import {
  baseHandleConvert,
  isListNode,
  isText,
} from "@/web/components/rich-text/util";
import type {
  BlocksStore,
  ListBlockFormat,
} from "@/web/components/rich-text/types";

import { List } from "./components";

const replaceListWithEmptyBlock = (editor: Editor, currentListPath: Path) => {
  // Delete the empty list
  Transforms.removeNodes(editor, { at: currentListPath });

  if (currentListPath[0] === 0) {
    // If the list was the only (or first) block element then insert empty paragraph as editor needs default value
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ type: "text", text: "" }],
      },
      { at: currentListPath },
    );
    Transforms.select(editor, currentListPath);
  }
};

/**
 * Common handler for the backspace event on ordered and unordered lists
 */
const handleBackspaceKeyOnList = (
  editor: Editor,
  event: React.KeyboardEvent<HTMLElement>,
) => {
  if (!editor.selection) {
    return;
  }

  const [currentListItem, currentListItemPath] = Editor.parent(
    editor,
    editor.selection.anchor,
  );
  const [currentList, currentListPath] = Editor.parent(
    editor,
    currentListItemPath,
  );
  const currentItem = currentListItem.children[0];

  const isListEmpty =
    currentList.children.length === 1 &&
    isText(currentItem) &&
    currentItem.text === "";
  const isListItemEmpty =
    currentListItem.children.length === 1 &&
    isText(currentListItem.children[0]) &&
    currentListItem.children[0].text === "";
  const isFocusAtTheBeginningOfAChild =
    editor.selection.focus.offset === 0 &&
    editor.selection.focus.path.at(-2) === 0;

  if (isListEmpty) {
    const parentListEntry = Editor.above(editor, {
      at: currentListPath,
      match: (node) => !Editor.isEditor(node) && node.type === "list",
    });
    if (!parentListEntry) {
      event.preventDefault();
      replaceListWithEmptyBlock(editor, currentListPath);
    }
  } else if (isFocusAtTheBeginningOfAChild) {
    // If the focus is at the beginning of a child node we need to replace it with a paragraph
    Transforms.liftNodes(editor, {
      match: (node) => !Editor.isEditor(node) && node.type === "list-item",
    });
    Transforms.setNodes(editor, { type: "paragraph" });
  } else if (isListItemEmpty) {
    const previousEntry = Editor.previous(editor, {
      at: currentListItemPath,
    });
    const nextEntry = Editor.next(editor, {
      at: currentListItemPath,
    });

    if (previousEntry && nextEntry) {
      // If previous and next nodes are lists or list-items, delete empty list item
      event.preventDefault();
      Transforms.removeNodes(editor, {
        at: currentListItemPath,
      });

      // If previous and next nodes are lists with same format and indent Levels, then merge the nodes
      const [previousList] = previousEntry;
      const [nextList] = nextEntry;
      if (
        !Editor.isEditor(previousList) &&
        !isText(previousList) &&
        isListNode(previousList) &&
        !Editor.isEditor(nextList) &&
        !isText(nextList) &&
        isListNode(nextList)
      ) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          previousList.type === "list" &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          nextList.type === "list" &&
          previousList.format === nextList.format &&
          previousList.indentLevel === nextList.indentLevel
        ) {
          Transforms.mergeNodes(editor, {
            at: currentListItemPath,
          });
        }
      }
    }
  }
};

/**
 * Common handler for the enter key on ordered and unordered lists
 */
const handleEnterKeyOnList = (editor: Editor) => {
  const currentListItemEntry = Editor.above(editor, {
    match: (node) => !Editor.isEditor(node) && node.type === "list-item",
  });

  if (!currentListItemEntry || !editor.selection) {
    return;
  }

  const [currentListItem, currentListItemPath] = currentListItemEntry;
  const [currentList, currentListPath] = Editor.parent(
    editor,
    currentListItemPath,
  );
  const isListEmpty =
    currentList.children.length === 1 &&
    isText(currentListItem.children[0]) &&
    currentListItem.children[0].text === "";
  const isListItemEmpty =
    currentListItem.children.length === 1 &&
    isText(currentListItem.children[0]) &&
    currentListItem.children[0].text === "";
  const isFocusAtTheBeginningOfAChild =
    editor.selection.focus.offset === 0 &&
    editor.selection.focus.path.at(-1) === 0;

  if (isListEmpty) {
    replaceListWithEmptyBlock(editor, currentListPath);
  } else if (isFocusAtTheBeginningOfAChild && !isListItemEmpty) {
    // If the focus is at the beginning of a child node, shift below the list item and create a new list-item
    const currentNode = Editor.above(editor, { at: editor.selection.anchor });
    Transforms.insertNodes(editor, {
      type: "list-item",
      children: [{ type: "text", text: "" }],
    });
    if (currentNode) {
      const path = currentNode[1];
      const updatedPath = [
        ...path.slice(0, -1),
        path[path.length - 1] ?? 0 + 1,
      ];
      Transforms.select(editor, {
        anchor: { path: updatedPath.concat(0), offset: 0 },
        focus: { path: updatedPath.concat(0), offset: 0 },
      });
    }
  } else if (isListItemEmpty) {
    // Check if there is a list above the current list and shift list-item under it
    if (
      !Editor.isEditor(currentList) &&
      isListNode(currentList) &&
      currentList.indentLevel &&
      currentList.indentLevel > 0
    ) {
      const previousIndentLevel = currentList.indentLevel - 1;

      const parentListNodeEntry = Editor.above(editor, {
        match: (node) =>
          !Editor.isEditor(node) &&
          node.type === "list" &&
          (node.indentLevel || 0) === previousIndentLevel,
      });

      if (parentListNodeEntry) {
        // Get the parent list path and add 1 to it to exit from the current list
        const modifiedPath = currentListItemPath.slice(0, -1);
        if (modifiedPath.length > 0) {
          // @ts-expect-error - modifiedPath is guaranteed to be at least one element
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          modifiedPath[modifiedPath.length - 1] += 1;
        }

        // Shift list-item under parent list
        Transforms.moveNodes(editor, {
          at: currentListItemPath,
          to: modifiedPath,
        });
        return;
      }
    }

    // Otherwise delete the empty list item and create a new paragraph below the parent list
    Transforms.removeNodes(editor, { at: currentListItemPath });

    const createdParagraphPath = Path.next(currentListPath);
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ type: "text", text: "" }],
      },
      { at: createdParagraphPath },
    );

    // Move the selection to the newly created paragraph
    Transforms.select(editor, createdParagraphPath);
  } else {
    // Check if the cursor is at the end of the list item
    const isNodeEnd = Editor.isEnd(
      editor,
      editor.selection.anchor,
      currentListItemPath,
    );

    if (isNodeEnd) {
      // If there was nothing after the cursor, create a fresh new list item,
      // in order to avoid carrying over the modifiers from the previous list item
      Transforms.insertNodes(editor, {
        type: "list-item",
        children: [{ type: "text", text: "" }],
      });
    } else {
      // If there is something after the cursor, split the current list item,
      // so that we keep the content and the modifiers
      Transforms.splitNodes(editor);
    }
  }
};

/**
 * Common handler for converting a node to a list
 */
const handleConvertToList = (editor: Editor, format: ListBlockFormat) => {
  const convertedPath = baseHandleConvert(editor, {
    type: "list-item",
  });

  if (!convertedPath) {
    return;
  }

  Transforms.wrapNodes(
    editor,
    { type: "list", format, children: [] },
    { at: convertedPath },
  );
};

/**
 * Common handler for the tab key on ordered and unordered lists
 */
const handleTabOnList = (editor: Editor) => {
  const currentListItemEntry = Editor.above(editor, {
    match: (node) => !Editor.isEditor(node) && node.type === "list-item",
  });

  if (!currentListItemEntry || !editor.selection) {
    return;
  }

  const [currentListItem, currentListItemPath] = currentListItemEntry;
  const [currentList] = Editor.parent(editor, currentListItemPath);

  // Skip tabbing if list-item is the first item in the list
  if (currentListItem === currentList.children[0]) {
    return;
  }

  const currentListItemIndex = currentList.children.findIndex(
    (item) => item === currentListItem,
  );
  const previousNode = currentList.children[currentListItemIndex - 1];

  // If previous node is a list block then move the list-item under it
  if (previousNode?.type === "list") {
    const nodePath = ReactEditor.findPath(editor, previousNode);
    const insertAtPath = previousNode.children.length;

    Transforms.moveNodes(editor, {
      at: currentListItemPath,
      to: nodePath.concat(insertAtPath),
    });
    return;
  }

  if (!Editor.isEditor(currentList) && isListNode(currentList)) {
    // Wrap list-item with list block on tab
    Transforms.wrapNodes(editor, {
      type: "list",
      format: currentList.format,
      indentLevel: (currentList.indentLevel || 0) + 1,
      children: [],
    });
  }
};

export const listBlocks: Pick<
  BlocksStore,
  "list-ordered" | "list-unordered" | "list-item"
> = {
  "list-ordered": {
    renderElement: (props) => <List {...props} />,
    label: "Numbered list",
    icon: ListOrdered,
    matchNode: (node) => node.type === "list" && node.format === "ordered",
    isInBlocksSelector: true,
    handleConvert: (editor) => {
      handleConvertToList(editor, "ordered");
    },
    handleEnterKey: handleEnterKeyOnList,
    handleBackspaceKey: handleBackspaceKeyOnList,
    handleTab: handleTabOnList,
    snippets: ["1."],
  },
  "list-unordered": {
    renderElement: (props) => <List {...props} />,
    label: "Bulleted list",
    icon: BulletList,
    matchNode: (node) => node.type === "list" && node.format === "unordered",
    isInBlocksSelector: true,
    handleConvert: (editor) => {
      handleConvertToList(editor, "unordered");
    },
    handleEnterKey: handleEnterKeyOnList,
    handleBackspaceKey: handleBackspaceKeyOnList,
    handleTab: handleTabOnList,
    snippets: ["-", "*", "+"],
  },
  "list-item": {
    renderElement: (props) => <li {...props.attributes}>{props.children}</li>,
    // No handleConvert, list items are created when converting to the parent list
    matchNode: (node) => node.type === "list-item",
    isInBlocksSelector: false,
  },
};
