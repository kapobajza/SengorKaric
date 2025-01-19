import * as Toolbar from "@radix-ui/react-toolbar";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { cn } from "@/web/lib/utils";
import { TooltipProvider } from "@/web/components/ui/tooltip";
import { modifiers } from "@/web/components/rich-text/modifiers";
import type {
  BlocksStore,
  ListBlockFormat,
  TextAlign,
} from "@/web/components/rich-text/types";
import { useRichText } from "@/web/components/rich-text/provider";
import { isListNode, isTextAlignNode } from "@/web/components/rich-text/util";
import { AudioRecordDialog } from "@/web/components/rich-text/audio/audio-record-dialog";

import { RichTextToolbarButton } from "./rich-text-toolbar-button";
import type { RichTextToolbarButtonProps } from "./rich-text-toolbar-button";

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

function TextAlignButton({
  block,
  align,
}: {
  block: BlocksStore["align-center"];
  align: TextAlign;
}) {
  const { editor } = useRichText();

  const isActive = () => {
    if (!editor.selection) {
      return false;
    }

    const selected = editor.children[editor.selection.anchor.path[0] ?? -1];

    if (selected && isTextAlignNode(selected)) {
      return selected.align === align;
    }

    return false;
  };

  function toggleTextAlign() {
    if (isActive()) {
      Transforms.setNodes(editor, {
        type: "paragraph",
      });
      return;
    }

    Transforms.setNodes(editor, {
      type: "text-align",
      align,
    });
  }

  return (
    <ToggleToolbarButton
      icon={block.icon}
      name={align}
      label={block.label}
      isActive={isActive()}
      disabled={false}
      handleClick={toggleTextAlign}
    />
  );
}

function ToolbarSeparator() {
  return <Toolbar.Separator className="mx-1 my-auto h-3/4 w-px bg-gray-300" />;
}

export function RichTextToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { blocks, editor } = useRichText();

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
      <div
        className={cn(
          "flex flex-wrap gap-1 rounded-md bg-muted p-1",
          className,
        )}
        {...props}
      >
        <Toolbar.Root className="flex">
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
            <TextAlignButton block={blocks["align-left"]} align="left" />
            <TextAlignButton block={blocks["align-center"]} align="center" />
            <TextAlignButton block={blocks["align-right"]} align="right" />
          </Toolbar.ToggleGroup>
          <ToolbarSeparator />
          <Toolbar.ToggleGroup className="flex gap-1" type="single">
            <AudioRecordDialog />
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      </div>
    </TooltipProvider>
  );
}
