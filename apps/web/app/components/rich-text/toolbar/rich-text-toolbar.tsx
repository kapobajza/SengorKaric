import * as Toolbar from "@radix-ui/react-toolbar";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { AlignCenter, AlignLeft, AlignRight, Redo, Undo } from "lucide-react";
import { useState } from "react";

import { cn } from "@/web/lib/utils";
import { TooltipProvider } from "@/web/components/ui/tooltip";
import { modifiers } from "@/web/components/rich-text/modifiers";
import { RichTextSelectedDropdownNodeMap } from "@/web/components/rich-text/types";
import type {
  BlocksStore,
  ListBlockFormat,
  RichTextSelectedDropdownNode,
  RootNode,
  TextAlign,
} from "@/web/components/rich-text/types";
import { useRichText } from "@/web/components/rich-text/provider";
import { isListNode } from "@/web/components/rich-text/util";
import { AudioRecordDialog } from "@/web/components/rich-text/audio/audio-record-dialog";

import { RichTextToolbarButton } from "./rich-text-toolbar-button";
import type { RichTextToolbarButtonProps } from "./rich-text-toolbar-button";
import { RichTextToolbarDropdownText } from "./rich-text-toolbar-dropdown-text";

function ToggleToolbarButton(
  props: Omit<RichTextToolbarButtonProps, "handleClick"> & {
    handleClick: () => void;
  },
) {
  const { editor } = useRichText();

  return (
    <RichTextToolbarButton
      {...props}
      handleClick={(e) => {
        e.preventDefault();
        props.handleClick();
        ReactEditor.focus(editor);
      }}
    />
  );
}

function ListButton({
  block,
  format,
}: {
  block: BlocksStore["list-ordered"];
  format: ListBlockFormat;
}) {
  const { blocks, editor } = useRichText();

  const isListActive = () => {
    if (!editor.selection) {
      return false;
    }

    // Get the parent list at selection anchor node
    const currentListEntry = Editor.above(editor, {
      match: (node) => !Editor.isEditor(node) && node.type === "list",
      at: editor.selection.anchor,
    });

    if (currentListEntry) {
      const [currentList] = currentListEntry;
      if (
        !Editor.isEditor(currentList) &&
        isListNode(currentList) &&
        currentList.format === format
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   * @TODO: Currently, applying list while multiple blocks are selected is not supported.
   * We should implement this feature in the future.
   */
  const isListDisabled = () => {
    // Always enabled when there's no selection
    if (!editor.selection) {
      return false;
    }

    // Get the block node closest to the anchor and focus
    const anchorNodeEntry = Editor.above(editor, {
      at: editor.selection.anchor,
      match: (node) => !Editor.isEditor(node) && node.type !== "text",
    });
    const focusNodeEntry = Editor.above(editor, {
      at: editor.selection.focus,
      match: (node) => !Editor.isEditor(node) && node.type !== "text",
    });

    if (!anchorNodeEntry || !focusNodeEntry) {
      return false;
    }

    // Disabled if the anchor and focus are not in the same block
    return anchorNodeEntry[0] !== focusNodeEntry[0];
  };

  const toggleList = (format: ListBlockFormat) => {
    let currentListEntry;
    if (editor.selection) {
      currentListEntry = Editor.above(editor, {
        match: (node) => !Editor.isEditor(node) && node.type === "list",
      });
    } else {
      // If no selection, toggle last inserted node
      const [_, lastNodePath] = Editor.last(editor, []);
      currentListEntry = Editor.above(editor, {
        match: (node) => !Editor.isEditor(node) && node.type === "list",
        at: lastNodePath,
      });
    }

    if (!currentListEntry) {
      // If selection is not a list then convert it to list
      blocks[`list-${format}`].handleConvert?.(editor);
      return;
    }

    // If selection is already a list then toggle format
    const [currentList, currentListPath] = currentListEntry;

    if (!Editor.isEditor(currentList) && isListNode(currentList)) {
      if (currentList.format !== format) {
        // Format is different, toggle list format
        Transforms.setNodes(editor, { format }, { at: currentListPath });
      } else {
        // Format is same, convert selected list-item to paragraph
        blocks["paragraph"].handleConvert?.(editor);
      }
    }
  };

  return (
    <RichTextToolbarButton
      icon={block.icon}
      name={format}
      label={block.label}
      isActive={isListActive()}
      disabled={isListDisabled()}
      handleClick={() => {
        toggleList(format);
      }}
    />
  );
}

function TextAlignButton({ align }: { align: TextAlign }) {
  const { editor } = useRichText();
  const checkButtonDisabled = () => {
    if (!editor.selection) {
      return false;
    }

    const selectedNode = editor.children[editor.selection.focus.path[0] ?? -1];

    if (!selectedNode) {
      return false;
    }

    if ((["audio", "list"] as RootNode["type"][]).includes(selectedNode.type)) {
      return true;
    }

    return false;
  };

  const isActive = () => {
    if (!editor.selection) {
      return false;
    }

    const selected = editor.children[editor.selection.anchor.path[0] ?? -1];
    return selected?.className === `text-${align}`;
  };

  function toggleTextAlign() {
    if (isActive()) {
      Transforms.setNodes(editor, {
        className: "",
      });
      return;
    }

    Transforms.setNodes(editor, {
      className: `text-${align}`,
    });
  }

  let AlignIcon = AlignLeft;

  if (align === "center") {
    AlignIcon = AlignCenter;
  } else if (align === "right") {
    AlignIcon = AlignRight;
  }

  return (
    <ToggleToolbarButton
      icon={AlignIcon}
      name={align}
      label={`Align ${align}`}
      isActive={isActive()}
      disabled={checkButtonDisabled()}
      handleClick={toggleTextAlign}
    />
  );
}

function ToolbarSeparator() {
  return <Toolbar.Separator className="mx-1 my-auto h-5 w-px bg-gray-300" />;
}

export function RichTextToolbar({
  className,
  ...props
}: React.ComponentProps<typeof Toolbar.Root>) {
  const { blocks, editor } = useRichText();
  const [selectedTextType, setSelectedTextType] =
    useState<RichTextSelectedDropdownNode>(
      RichTextSelectedDropdownNodeMap.paragraph,
    );

  /**
   * The modifier buttons are disabled when an image is selected.
   */
  const checkButtonDisabled = () => {
    if (!editor.selection) {
      return false;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0] ?? -1];

    if (!selectedNode) {
      return false;
    }

    if (["image", "code"].includes(selectedNode.type)) {
      return true;
    }

    return false;
  };

  const isButtonDisabled = checkButtonDisabled();

  return (
    <TooltipProvider>
      <Toolbar.Root
        className={cn(
          "flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-input bg-muted p-1",
          className,
        )}
        {...props}
      >
        <Toolbar.ToggleGroup className="flex gap-1" type="single">
          <RichTextToolbarDropdownText
            selected={selectedTextType}
            setSelected={setSelectedTextType}
          />
        </Toolbar.ToggleGroup>
        <ToolbarSeparator />
        <Toolbar.ToggleGroup type="multiple" className="flex gap-1">
          {Object.entries(modifiers).map(([name, modifier]) => (
            <ToggleToolbarButton
              key={name}
              name={name}
              icon={modifier.icon}
              label={modifier.label}
              isActive={modifier.checkIsActive(editor)}
              handleClick={() => {
                modifier.handleToggle(editor);
              }}
              disabled={isButtonDisabled}
            />
          ))}
        </Toolbar.ToggleGroup>
        <ToolbarSeparator />
        <Toolbar.ToggleGroup className="flex gap-1" type="single">
          <ListButton block={blocks["list-unordered"]} format="unordered" />
          <ListButton block={blocks["list-ordered"]} format="ordered" />
        </Toolbar.ToggleGroup>
        <ToolbarSeparator />
        <Toolbar.ToggleGroup className="flex gap-1" type="single">
          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
        </Toolbar.ToggleGroup>
        <ToolbarSeparator />
        <Toolbar.ToggleGroup className="flex gap-1" type="single">
          <AudioRecordDialog />
        </Toolbar.ToggleGroup>
        <ToolbarSeparator />
        <Toolbar.ToggleGroup className="flex gap-1" type="single">
          <RichTextToolbarButton
            icon={Undo}
            label="Undo"
            name="undo"
            handleClick={() => {
              editor.undo();
            }}
          />
          <RichTextToolbarButton
            icon={Redo}
            label="Redo"
            name="redo"
            handleClick={() => {
              editor.redo();
            }}
          />
        </Toolbar.ToggleGroup>
      </Toolbar.Root>
    </TooltipProvider>
  );
}
