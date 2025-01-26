/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Editable, ReactEditor } from "slate-react";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { Editor, Transforms } from "slate";

import { Textarea } from "@/web/components/ui/textarea";

import type { BlocksStore } from "./types";
import { modifiers } from "./modifiers";
import type { ModifiersStore } from "./modifiers";
import { useRichText } from "./provider";

type BaseRenderElementProps = {
  props: RenderElementProps;
  blocks: BlocksStore;
};

type ExtendedRenderLeafProps = {
  leaf: RenderLeafProps["leaf"] & { className?: string };
} & RenderLeafProps;

const baseRenderElement = ({ props, blocks }: BaseRenderElementProps) => {
  const blockMatch = Object.values(blocks).find((block) =>
    block.matchNode(props.element),
  );
  const block = blockMatch || blocks.paragraph;

  return block.renderElement(props);
};

// Wrap Object.entries to get the correct types
const getEntries = <T extends object>(object: T) => {
  return Object.entries(object) as [keyof T, T[keyof T]][];
};

const baseRenderLeaf = (
  props: ExtendedRenderLeafProps,
  modifiers: ModifiersStore,
) => {
  // Recursively wrap the children for each active modifier
  const wrappedChildren = getEntries(modifiers).reduce(
    (currentChildren, modifierEntry) => {
      const [name, modifier] = modifierEntry;

      if (props.leaf[name]) {
        return modifier.renderLeaf(currentChildren);
      }

      return currentChildren;
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    props.children as React.JSX.Element | string,
  );

  return (
    <span {...props.attributes} className={props.leaf.className}>
      {wrappedChildren}
    </span>
  );
};

export function RichTextContent() {
  const { blocks, editor } = useRichText();

  const renderElement = (props: RenderElementProps) => {
    return baseRenderElement({
      props,
      blocks,
    });
  };

  const renderLeaf = (props: ExtendedRenderLeafProps) => {
    return baseRenderLeaf(props, modifiers);
  };

  const checkSnippet = (event: React.KeyboardEvent<HTMLElement>) => {
    // Get current text block
    if (!editor.selection) {
      return;
    }

    const [textNode, textNodePath] = Editor.node(
      editor,
      editor.selection.anchor.path,
    );

    // Narrow the type to a text node
    if (Editor.isEditor(textNode) || textNode.type !== "text") {
      return;
    }

    // Don't check for snippets if we're not at the start of a block
    if (textNodePath.at(-1) !== 0) {
      return;
    }

    // Check if the text node starts with a known snippet
    const blockMatchingSnippet = Object.values(blocks).find((block) => {
      return block.snippets?.includes(textNode.text);
    });

    if (blockMatchingSnippet?.handleConvert) {
      // Prevent the space from being created and delete the snippet
      event.preventDefault();
      Transforms.delete(editor, {
        distance: textNode.text.length,
        unit: "character",
        reverse: true,
      });
      blockMatchingSnippet.handleConvert(editor);
    }
  };

  const handleEnter = (_event: React.KeyboardEvent<HTMLElement>) => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0] ?? -1];

    if (!selectedNode) {
      return;
    }

    const selectedBlock = Object.values(blocks).find((block) =>
      block.matchNode(selectedNode),
    );

    if (!selectedBlock) {
      return;
    }

    // Check if there's an enter handler for the selected block
    if (selectedBlock.handleEnterKey) {
      selectedBlock.handleEnterKey(editor);
    } else {
      blocks.paragraph.handleEnterKey?.(editor);
    }
  };

  const handleBackspaceEvent = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0] ?? -1];

    if (!selectedNode) {
      return;
    }

    const selectedBlock = Object.values(blocks).find((block) =>
      block.matchNode(selectedNode),
    );

    if (!selectedBlock) {
      return;
    }

    if (selectedBlock.handleBackspaceKey) {
      selectedBlock.handleBackspaceKey(editor, event);
    }
  };

  const handleTab = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0] ?? -1];

    if (!selectedNode) {
      return;
    }

    const selectedBlock = Object.values(blocks).find((block) =>
      block.matchNode(selectedNode),
    );

    if (!selectedBlock) {
      return;
    }

    if (selectedBlock.handleTab) {
      event.preventDefault();
      selectedBlock.handleTab(editor);
    }
  };

  const handleKeyboardShortcuts = (event: React.KeyboardEvent<HTMLElement>) => {
    const isCtrlOrCmd = event.metaKey || event.ctrlKey;

    if (isCtrlOrCmd) {
      // Check if there's a modifier to toggle
      Object.values(modifiers).forEach((value) => {
        if (value.isValidEventKey(event)) {
          value.handleToggle(editor);
          return;
        }
      });
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    // Find the right block-specific handlers for enter and backspace key presses
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        return handleEnter(event);
      case "Backspace":
        return handleBackspaceEvent(event);
      case "Tab":
        return handleTab(event);
      case "Escape":
        return ReactEditor.blur(editor);
    }

    handleKeyboardShortcuts(event);

    // Check if a snippet was triggered
    if (event.key === " ") {
      checkSnippet(event);
    }
  };

  return (
    <Textarea className="mb-6 flex min-h-52 w-full grow-[1]" asChild>
      <Editable
        disableDefaultStyles
        className="h-full flex-col gap-1 whitespace-pre break-words"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
      />
    </Textarea>
  );
}
